import { Tabs, TabsContent, TabsList, TabsTrigger } from "@feather/ui/tabs";
import { Suspense } from "react";
import { getSession } from "~/auth/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
	CreateTweetForm,
	TweetCardSkeleton,
	TweetFollowing,
	TweetList,
} from "./_components/tweets";

export default async function TweetsPage() {
	const session = await getSession();
	const isAuthed = !!session?.user.id;

	prefetch(
		trpc.tweet.following.infiniteQueryOptions(
			{},
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		),
	);
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

					<Tabs defaultValue={isAuthed ? "following" : "global"}>
						<TabsList className="w-full justify-start rounded-none border-b border-border bg-background">
							<TabsTrigger value="global" className="flex-1 cursor-pointer">
								Global
							</TabsTrigger>
							<TabsTrigger value="following" className="flex-1 cursor-pointer">
								Following
							</TabsTrigger>
						</TabsList>

						<TabsContent value="global" className="mt-0">
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
						</TabsContent>

						<TabsContent value="following" className="mt-0">
							{isAuthed ? (
								<Suspense
									fallback={
										<div className="flex flex-col">
											{Array.from({ length: 5 }).map(() => (
												<TweetCardSkeleton />
											))}
										</div>
									}
								>
									<TweetFollowing />
								</Suspense>
							) : (
								<div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
									<p className="text-lg font-medium text-foreground">
										No tweets yet
									</p>
									<p className="text-sm">
										Sign in to begin seeing tweets from friends.
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</HydrateClient>
	);
}
