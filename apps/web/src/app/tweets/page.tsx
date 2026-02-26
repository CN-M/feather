import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
	CreateTweetForm,
	TweetCardSkeleton,
	TweetList,
} from "../_components/tweets";

export default function TweetsPage() {
	prefetch(trpc.tweet.all.queryOptions());

	return (
		<HydrateClient>
			<main className="flex min-h-screen justify-center bg-background">
				<div className="w-full max-w-2xl border-x border-border">
					<div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-4 py-4">
						<h1 className="text-lg font-semibold">Home</h1>
					</div>

					<CreateTweetForm />

					<Suspense
						fallback={
							<div className="flex flex-col">
								<TweetCardSkeleton />
								<TweetCardSkeleton />
								<TweetCardSkeleton />
								<TweetCardSkeleton />
								<TweetCardSkeleton />
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
