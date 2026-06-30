import type { QueryClient, QueryFilters } from "@tanstack/react-query";

/**
 * Helpers for optimistically editing tweets across every cached tweet query
 * at once — the global/following/profile feeds (infinite, `{ pages }`) and the
 * single-tweet `byId` cache. Callers pass `trpc.tweet.pathFilter()` so the edit
 * fans out to all of them.
 *
 * We only touch the interaction counters, so the patch is shallow-merged onto
 * each tweet, preserving any other fields the cache holds.
 */

interface TweetLike {
	id: string;
	likeCount: number;
	likedByUser: boolean;
}

interface FeedPage {
	tweets: TweetLike[];
	nextCursor: Date | null;
}

interface InfiniteFeed {
	pages: FeedPage[];
	pageParams: unknown[];
}

function isInfiniteFeed(data: unknown): data is InfiniteFeed {
	return typeof data === "object" && data !== null && "pages" in data;
}

function isSingleTweet(data: unknown): data is TweetLike {
	return (
		typeof data === "object" &&
		data !== null &&
		"id" in data &&
		"likedByUser" in data
	);
}

export function updateTweetInCaches(
	queryClient: QueryClient,
	filter: QueryFilters,
	tweetId: string,
	patch: (tweet: TweetLike) => Partial<TweetLike>,
) {
	queryClient.setQueriesData<unknown>(filter, (data: unknown) => {
		if (isInfiniteFeed(data)) {
			return {
				...data,
				pages: data.pages.map((page) => ({
					...page,
					tweets: page.tweets.map((tweet) =>
						tweet.id === tweetId ? { ...tweet, ...patch(tweet) } : tweet,
					),
				})),
			};
		}
		if (isSingleTweet(data) && data.id === tweetId) {
			return { ...data, ...patch(data) };
		}
		return data;
	});
}

export function removeTweetFromCaches(
	queryClient: QueryClient,
	filter: QueryFilters,
	tweetId: string,
) {
	queryClient.setQueriesData<unknown>(filter, (data: unknown) => {
		if (isInfiniteFeed(data)) {
			return {
				...data,
				pages: data.pages.map((page) => ({
					...page,
					tweets: page.tweets.filter((tweet) => tweet.id !== tweetId),
				})),
			};
		}
		return data;
	});
}
