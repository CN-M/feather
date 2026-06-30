"use client";

import type { RouterOutputs } from "@feather/api";
import { cn } from "@feather/ui";
import { Button } from "@feather/ui/button";
import { Heart, MessageCircle } from "@feather/ui/icons";
import { toast } from "@feather/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

type TweetPage = RouterOutputs["tweet"]["all"];
type Tweet = TweetPage["tweets"][number];

export function TweetCard({ tweet }: { tweet: Tweet }) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();

	const prefetchProfile = (profileId: string) => {
		queryClient.prefetchQuery(trpc.user.profile.queryOptions({ profileId }));
	};

	// const likeTweet = useMutation(
	// 	trpc.tweet.like.mutationOptions({
	// 		onSuccess: async () => {
	// 			await queryClient.invalidateQueries(trpc.tweet.pathFilter());
	// 		},
	// 		onError: (err) => {
	// 			toast.error(
	// 				err.data?.code === "UNAUTHORIZED"
	// 					? "You must be logged in to like a tweet"
	// 					: "Failed to like tweet",
	// 			);
	// 		},
	// 	}),
	// );

	const likeTweet = useMutation(
		trpc.tweet.like.mutationOptions({
			onMutate: async ({ tweetId }) => {
				await queryClient.cancelQueries(trpc.tweet.pathFilter());

				const previousData = queryClient.getQueryData(
					trpc.tweet.all.infiniteQueryOptions({}).queryKey,
				);

				queryClient.setQueryData(
					trpc.tweet.all.infiniteQueryOptions({}).queryKey,
					(old) => {
						if (!old) return old;
						return {
							...old,
							pages: old.pages.map((page) => ({
								...page,
								tweets: page.tweets.map((t) =>
									t.id === tweetId
										? { ...t, likedByUser: true, likeCount: t.likeCount + 1 }
										: t,
								),
							})),
						};
					},
				);

				return { previousData };
			},
			onError: (_err, _, context) => {
				queryClient.setQueryData(
					trpc.tweet.all.infiniteQueryOptions({}).queryKey,
					context?.previousData,
				);
				toast.error("Failed to like tweet");
			},
			onSettled: () => {
				queryClient.invalidateQueries(trpc.tweet.pathFilter());
			},
		}),
	);

	const unlikeTweet = useMutation(
		trpc.tweet.unlike.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.tweet.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to unlike a tweet"
						: "Failed to unlike tweet",
				);
			},
		}),
	);

	const deleteTweet = useMutation(
		trpc.tweet.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.tweet.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to delete a tweet"
						: "Failed to delete tweet",
				);
			},
		}),
	);

	const isAuthor = session?.user.id === tweet.author.id;

	return (
		<div className="group relative flex w-full gap-4 border-b border-border px-4 py-5 transition-colors hover:bg-muted/40">
			<div className="shrink-0">
				<Link
					href={`/${tweet.author.id}`}
					prefetch
					onMouseEnter={() => prefetchProfile(tweet.author.id)}
				>
					{tweet.author.image ? (
						<div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/10">
							<Image
								src={tweet.author.image}
								fill
								alt={tweet.author.name ?? "User avatar"}
								className="object-cover"
								unoptimized
							/>
						</div>
					) : (
						<div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
							{tweet.author.name?.[0] ?? "U"}
						</div>
					)}
				</Link>
			</div>

			<div className="flex w-full flex-col">
				<div className="flex items-center gap-2">
					<Link
						href={`/${tweet.author.id}`}
						prefetch
						onMouseEnter={() => prefetchProfile(tweet.author.id)}
					>
						<span className="font-semibold text-sm">
							{tweet.author.name ?? "Unknown"}
						</span>
					</Link>
					<span className="text-xs text-muted-foreground">
						· {new Date(tweet.createdAt).toLocaleDateString()}
					</span>

					{isAuthor && (
						<Button
							variant="ghost"
							size="icon"
							className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => deleteTweet.mutate({ id: tweet.id })}
							disabled={deleteTweet.isPending}
						>
							✕
						</Button>
					)}
				</div>

				{/* Body */}
				<p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
					{tweet.content}
				</p>

				{/* Actions */}
				<div className="mt-4 flex items-center gap-6 text-muted-foreground text-xs">
					<span className="flex items-center justify-center gap-1.5">
						<button
							type="button"
							onClick={() => {
								if (!session?.user.id) return;
								if (tweet.likedByUser) {
									unlikeTweet.mutate({ tweetId: tweet.id });
								} else {
									likeTweet.mutate({ tweetId: tweet.id });
								}
							}}
						>
							<Heart
								className={cn(
									"h-5 w-5 md:hover:text-primary transition-colors cursor-pointer",
									tweet.likedByUser
										? "text-emerald-500"
										: "text-muted-foreground",
								)}
							/>
						</button>

						<span className="text-sm">{tweet.likeCount ?? 0}</span>
					</span>

					<Link
						href={`/tweet/${tweet.id}`}
						prefetch
						aria-label="View thread"
						className="flex items-center justify-center transition-colors hover:text-primary"
					>
						<MessageCircle className="h-5 w-5" />
					</Link>
				</div>
			</div>
		</div>
	);
}

export function TweetCardSkeleton({ pulse = true }: { pulse?: boolean }) {
	return (
		<div className="flex w-full gap-4 border-b border-border px-4 py-5">
			{/* Avatar */}
			<div
				className={cn(
					"h-10 w-10 shrink-0 rounded-full bg-muted",
					pulse && "animate-pulse",
				)}
			/>

			{/* Content */}
			<div className="flex w-full flex-col gap-3">
				{/* Header row */}
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"h-4 w-24 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
					<div
						className={cn(
							"h-3 w-16 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
				</div>

				{/* Body lines */}
				<div
					className={cn("h-4 w-5/6 rounded bg-muted", pulse && "animate-pulse")}
				/>
				<div
					className={cn("h-4 w-2/3 rounded bg-muted", pulse && "animate-pulse")}
				/>

				{/* Action row */}
				<div className="mt-2 flex gap-6">
					<div
						className={cn(
							"h-3 w-12 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
					<div
						className={cn(
							"h-3 w-12 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
				</div>
			</div>
		</div>
	);
}
