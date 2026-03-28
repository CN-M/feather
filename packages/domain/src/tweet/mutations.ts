import { and, type DB, eq } from "@feather/db";
import { like, tweet } from "@feather/db/schema";
import type { CreateTweetInput } from "./schemas";

export const createTweet = (
	db: DB,
	input: CreateTweetInput & { authorId: string },
) => {
	return db.insert(tweet).values({
		content: input.content,
		authorId: input.authorId,
	});
};

export async function deleteTweet(db: DB, id: string) {
	return db.delete(tweet).where(eq(tweet.id, id));
}

export const likeTweet = async (
	db: DB,
	input: { tweetId: string; userId: string },
) => {
	const { tweetId, userId } = input;

	return db
		.insert(like)
		.values({
			tweetId,
			userId,
		})
		.returning({
			id: like.id,
			tweetId: like.tweetId,
			userId: like.userId,
		});
};

// export async function unlikeTweet(db: DB, input: { likeId: string }) {
export async function unlikeTweet(
	db: DB,
	input: { tweetId: string; userId: string },
) {
	const { tweetId, userId } = input;

	return db
		.delete(like)
		.where(and(eq(like.tweetId, tweetId), eq(like.userId, userId)))
		.returning({ id: like.id, tweetId: like.tweetId, userId: like.userId });
}
