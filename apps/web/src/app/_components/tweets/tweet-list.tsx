"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
// import { TweetCard, TweetCardSkeleton } from "./tweet-card";
import { TweetCard } from "./tweet-card";

export function TweetList() {
	const trpc = useTRPC();
	const { data: tweets } = useSuspenseQuery(trpc.tweet.all.queryOptions());

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
		</div>
	);
}
