import { type DB, desc, eq } from "@feather/db";
import { tweet } from "@feather/db/schema";

export async function getAllTweets(db: DB) {
	return db.query.tweet.findMany({
		orderBy: desc(tweet.createdAt),
		limit: 20,
		with: {
			author: true,
			likes: true,
		},
	});
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
