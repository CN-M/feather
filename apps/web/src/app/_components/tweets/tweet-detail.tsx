"use client";

import { ArrowLeft } from "@feather/ui/icons";
import {
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTRPC } from "~/trpc/react";
import { CreateTweetForm } from "./create-tweet-form";
import { TweetCard } from "./tweet-card";

export function TweetDetail({ tweetId }: { tweetId: string }) {
	const trpc = useTRPC();
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data: tweet } = useSuspenseQuery(
		trpc.tweet.byId.queryOptions({ id: tweetId }),
	);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery(
			trpc.tweet.replies.infiniteQueryOptions(
				{ tweetId },
				{ getNextPageParam: (lastPage) => lastPage.nextCursor },
			),
		);

	const replies = data.pages.flatMap((page) => page.tweets);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage();
			},
			{ threshold: 0.1 },
		);
		if (bottomRef.current) observer.observe(bottomRef.current);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage]);

	return (
		<main className="flex min-h-screen justify-center bg-background">
			<div className="w-full max-w-2xl border-x border-border">
				<div className="sticky top-0 z-10 flex items-center gap-6 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
					<Link
						href="/"
						aria-label="Back to feed"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1 className="text-lg font-semibold">Thread</h1>
				</div>

				{tweet ? (
					<>
						<TweetCard tweet={tweet} />

						<CreateTweetForm
							parentId={tweetId}
							placeholder="Tweet your reply"
							submitLabel="Reply"
						/>

						{replies.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
								<p className="text-sm">No replies yet — be the first.</p>
							</div>
						) : (
							replies.map((reply) => <TweetCard key={reply.id} tweet={reply} />)
						)}

						<div
							ref={bottomRef}
							className="py-4 text-center text-sm text-muted-foreground"
						>
							{isFetchingNextPage ? "Loading more..." : null}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
						<p className="text-lg font-medium text-foreground">
							Tweet not found
						</p>
						<p className="text-sm">It may have been deleted.</p>
					</div>
				)}
			</div>
		</main>
	);
}
