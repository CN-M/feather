import { type DB, desc, eq, lt, sql } from "@feather/db";
import { like, tweet, user } from "@feather/db/schema";

export async function getAllTweets(db: DB, cursor?: Date) {
	const tweets = await db
		.select({
			id: tweet.id,
			content: tweet.content,
			createdAt: tweet.createdAt,
			author: {
				id: user.id,
				name: user.name,
				image: user.image,
			},
			likeCount: sql<number>`count(${like.id})`.mapWith(Number),
		})
		.from(tweet)
		.innerJoin(user, eq(tweet.authorId, user.id))
		.leftJoin(like, eq(tweet.id, like.tweetId))
		.where(cursor ? lt(tweet.createdAt, cursor) : undefined)
		.groupBy(tweet.id, user.id)
		.orderBy(desc(tweet.createdAt))
		.limit(20);

	return {
		tweets,
		nextCursor:
			tweets.length === 20 ? tweets[tweets.length - 1]?.createdAt : null,
	};
}

export async function getTweetById(db: DB, id: string) {
	return db.query.tweet.findFirst({
		where: eq(tweet.id, id),
		with: {
			author: true,
			likes: true,
		},
	});
}
