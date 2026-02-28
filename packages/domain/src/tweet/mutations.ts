import { type DB, eq } from "@feather/db";
import { tweet } from "@feather/db/schema";
import type { CreateTweetInput } from "./schemas";

export async function createTweet(
	db: DB,
	input: CreateTweetInput & { authorId: string },
) {
	return db.insert(tweet).values({
		content: input.content,
		authorId: input.authorId,
	});
}

export async function deleteTweet(db: DB, id: string) {
	return db.delete(tweet).where(eq(tweet.id, id));
}
