import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
	CreateTweetForm,
	TweetCardSkeleton,
	TweetList,
} from "./_components/tweets";

export default function TweetsPage() {
	prefetch(
		trpc.tweet.all.infiniteQueryOptions(
			{},
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		),
	);

	return (
		<HydrateClient>
			<main className="flex min-h-screen justify-center bg-background">
				<div className="w-full max-w-2xl border-x border-border">
					<CreateTweetForm />

					<Suspense
						fallback={
							<div className="flex flex-col">
								{Array.from({ length: 5 }).map(() => (
									<TweetCardSkeleton />
								))}
							</div>
						}
					>
						<TweetList />
					</Suspense>
				</div>
			</main>
		</HydrateClient>
	);
}
