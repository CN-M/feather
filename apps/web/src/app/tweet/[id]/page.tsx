import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { TweetDetail } from "../../_components/tweets/tweet-detail";

export default async function TweetThreadPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	await Promise.all([
		prefetch(trpc.tweet.byId.queryOptions({ id })),
		prefetch(
			trpc.tweet.replies.infiniteQueryOptions(
				{ tweetId: id },
				{ getNextPageParam: (lastPage) => lastPage.nextCursor },
			),
		),
	]);

	return (
		<HydrateClient>
			<TweetDetail tweetId={id} />
		</HydrateClient>
	);
}
