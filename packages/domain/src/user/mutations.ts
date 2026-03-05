import { type DB, eq } from "@feather/db";
import { follow } from "@feather/db/schema";

export async function createFollow(
	db: DB,
	input: { followerId: string; followingId: string },
) {
	const { followerId, followingId } = input;

	return db
		.insert(follow)
		.values({
			followerId,
			followingId,
		})
		.returning({
			id: follow.id,
			followerId: follow.followerId,
			followingId: follow.followingId,
		});
}

export async function deleteFollow(db: DB, input: { followId: string }) {
	const { followId } = input;
	return db.delete(follow).where(eq(follow.id, followId)).returning();
}
