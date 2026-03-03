"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useTRPC } from "~/trpc/react";
import { TweetCard } from "./tweet-card";

export function TweetList() {
	const trpc = useTRPC();
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery(
			trpc.tweet.all.infiniteQueryOptions(
				{},
				{
					getNextPageParam: (lastPage) => lastPage.nextCursor,
				},
			),
		);

	const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

	// Automatically fetch next page when bottom is visible
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (bottomRef.current) observer.observe(bottomRef.current);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage]);

	if (tweets.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
				<p className="text-lg font-medium text-foreground">No tweets yet</p>
				<p className="text-sm">Be the first to start the conversation.</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			{tweets.map((tweet) => (
				<TweetCard key={tweet.id} tweet={tweet} />
			))}
			<div
				ref={bottomRef}
				className="py-4 text-center text-sm text-muted-foreground"
			>
				{isFetchingNextPage
					? "Loading more..."
					: hasNextPage
						? ""
						: "You're all caught up."}
			</div>
		</div>
	);
}
