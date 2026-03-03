import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
	CreateTweetForm,
	TweetCardSkeleton,
	TweetList,
} from "./_components/tweets";
import { WorkInProgressBanner } from "./_components/work-in-progress-banner";

export default function TweetsPage() {
	prefetch(trpc.tweet.all.queryOptions());

	return (
		<HydrateClient>
			<main className="flex min-h-screen justify-center bg-background">
				<div className="w-full max-w-2xl border-x border-border">
					<WorkInProgressBanner />
					<div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-4 py-4">
						<h1 className="text-lg font-semibold">Home</h1>
					</div>

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
