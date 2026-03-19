"use client";

import { Skeleton } from "@feather/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@feather/ui/tabs";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense, useEffect, useRef } from "react";
import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";
import { TweetCard } from "../tweets/tweet-card";
import { FollowButton } from "./follow-button";

export const ProfileView = ({ profileId }: { profileId: string }) => {
	const trpc = useTRPC();
	const bottomPostsRef = useRef<HTMLDivElement>(null);
	const bottomLikesRef = useRef<HTMLDivElement>(null);

	const { data: session } = authClient.useSession();

	const { data: user } = useSuspenseQuery(
		trpc.user.profile.queryOptions({ profileId }),
	);

	const {
		data: profileFeedData,
		fetchNextPage: fetchNextPosts,
		hasNextPage: hasNextPosts,
		isFetchingNextPage: isFetchingNextPosts,
	} = useSuspenseInfiniteQuery(
		trpc.tweet.profileFeed.infiniteQueryOptions(
			// { profileId: user.id },
			{ profileId },
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		),
	);

	const {
		data: likedFeedData,
		fetchNextPage: fetchNextLikes,
		hasNextPage: hasNextLikes,
		isFetchingNextPage: isFetchingNextLikes,
	} = useSuspenseInfiniteQuery(
		trpc.tweet.profileLikeFeed.infiniteQueryOptions(
			{ profileId },
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		),
	);

	const posts = profileFeedData.pages.flatMap((page) => page.tweets);
	const likes = likedFeedData.pages.flatMap((page) => page.tweets);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPosts) fetchNextPosts();
			},
			{ threshold: 0.1 },
		);
		if (bottomPostsRef.current) observer.observe(bottomPostsRef.current);
		return () => observer.disconnect();
	}, [fetchNextPosts, hasNextPosts]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextLikes) fetchNextLikes();
			},
			{ threshold: 0.1 },
		);
		if (bottomLikesRef.current) observer.observe(bottomLikesRef.current);
		return () => observer.disconnect();
	}, [fetchNextLikes, hasNextLikes]);

	const followerId = session?.user.id;

	return (
		<main className="flex min-h-screen justify-center bg-background">
			<div className="w-full max-w-2xl border-x border-border">
				<div className="border-b border-border px-4 py-6">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-xl font-semibold">{user.name}</h1>
							<div className="mt-3 flex gap-6 text-sm">
								<span>
									<strong>{user.followingCount}</strong> Following
								</span>
								<span>
									<strong>{user.followerCount}</strong> Followers
								</span>
							</div>
						</div>

						<Suspense fallback={<Skeleton className="h-8 w-25" />}>
							{followerId && followerId !== user.id ? (
								<FollowButton followingId={user.id} followerId={followerId} />
							) : null}
						</Suspense>
					</div>
				</div>

				<Tabs defaultValue="posts">
					<TabsList className="w-full justify-start rounded-none border-b border-border bg-background">
						<TabsTrigger value="posts" className="flex-1">
							Posts
						</TabsTrigger>
						<TabsTrigger value="likes" className="flex-1">
							Likes
						</TabsTrigger>
					</TabsList>

					<TabsContent value="posts" className="mt-0">
						{posts.map((tweet) => (
							<TweetCard key={tweet.id} tweet={tweet} />
						))}
						<div
							ref={bottomPostsRef}
							className="py-4 text-center text-sm text-muted-foreground"
						>
							{isFetchingNextPosts
								? "Loading more..."
								: hasNextPosts
									? ""
									: "You're all caught up."}
						</div>
					</TabsContent>

					<TabsContent value="likes" className="mt-0">
						{likes.map((tweet) => (
							<TweetCard key={tweet.id} tweet={tweet} />
						))}
						<div
							ref={bottomLikesRef}
							className="py-4 text-center text-sm text-muted-foreground"
						>
							{isFetchingNextLikes
								? "Loading more..."
								: hasNextLikes
									? ""
									: "You're all caught up."}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
};
