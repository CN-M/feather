import { alias, and, type DB, desc, eq, lt, sql } from "@feather/db";
import { follow, like, tweet, user } from "@feather/db/schema";

export async function getAllTweets(db: DB, userId?: string, cursor?: Date) {
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
			likedByUser:
				sql<boolean>`bool_or(${like.userId} = ${userId ?? null})`.mapWith(
					Boolean,
				),
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
		nextCursor: tweets.length === 20 ? tweets.at(-1)?.createdAt : null,
	};
}

export async function getFollowFeed(db: DB, userId: string, cursor?: Date) {
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
			likedByUser: sql<boolean>`bool_or(${like.userId} = ${userId})`.mapWith(
				Boolean,
			),
		})
		.from(tweet)
		.innerJoin(user, eq(tweet.authorId, user.id))
		.innerJoin(follow, eq(follow.followingId, tweet.authorId))
		.leftJoin(like, eq(tweet.id, like.tweetId))
		.where(
			and(
				eq(follow.followerId, userId),
				cursor ? lt(tweet.createdAt, cursor) : undefined,
			),
		)
		.groupBy(tweet.id, user.id)
		.orderBy(desc(tweet.createdAt))
		.limit(20);

	return {
		tweets,
		nextCursor: tweets.length === 20 ? tweets.at(-1)?.createdAt : null,
	};
}

export async function getTweetById(db: DB, id: string, userId?: string) {
	const [singleTweet] = await db
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
			likedByUser:
				sql<boolean>`bool_or(${like.userId} = ${userId ?? null})`.mapWith(
					Boolean,
				),
		})
		.from(tweet)
		.innerJoin(user, eq(tweet.authorId, user.id))
		.leftJoin(like, eq(tweet.id, like.tweetId))
		.where(eq(tweet.id, id))
		.groupBy(tweet.id, user.id)
		.limit(1);

	return singleTweet;
}

export async function getProfileFeedbyId(
	db: DB,
	profileId: string,
	userId?: string,
	cursor?: Date,
) {
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
			likedByUser:
				sql<boolean>`bool_or(${like.userId} = ${userId ?? null})`.mapWith(
					Boolean,
				),
		})
		.from(tweet)
		.innerJoin(user, eq(tweet.authorId, user.id))
		.leftJoin(like, eq(tweet.id, like.tweetId))
		.where(
			and(
				cursor ? lt(tweet.createdAt, cursor) : undefined,
				eq(tweet.authorId, profileId),
			),
		)
		.groupBy(tweet.id, user.id)
		.orderBy(desc(tweet.createdAt))
		.limit(20);

	return {
		tweets,
		nextCursor: tweets.length === 20 ? tweets.at(-1)?.createdAt : null,
	};
}

const allLikes = alias(like, "allLikes");

export async function getTweetsLikedByProfile(
	db: DB,
	profileId: string,
	userId?: string,
	cursor?: Date,
) {
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
			likeCount: sql<number>`count(${allLikes.id})`.mapWith(Number),
			likedByUser:
				sql<boolean>`bool_or(${allLikes.userId} = ${userId ?? null})`.mapWith(
					Boolean,
				),
		})
		.from(like)
		.innerJoin(tweet, eq(like.tweetId, tweet.id))
		.innerJoin(user, eq(tweet.authorId, user.id))
		.leftJoin(allLikes, eq(tweet.id, allLikes.tweetId))
		.where(
			and(
				eq(like.userId, profileId),
				cursor ? lt(tweet.createdAt, cursor) : undefined,
			),
		)
		.groupBy(tweet.id, user.id)
		.orderBy(desc(tweet.createdAt))
		.limit(20);

	return {
		tweets,
		nextCursor: tweets.length === 20 ? tweets.at(-1)?.createdAt : null,
	};
}
