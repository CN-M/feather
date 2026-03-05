import { and, type DB, eq, or, sql } from "@feather/db";
import { follow, user } from "@feather/db/schema";

export async function getUserProfileById(db: DB, userId: string) {
	const [profile] = await db
		.select({
			id: user.id,
			name: user.name,
			image: user.image,
			followingCount:
				sql<number>`count(distinct case when ${follow.followerId} = ${userId} then ${follow.id} end)`.mapWith(
					Number,
				),
			followerCount:
				sql<number>`count(distinct case when ${follow.followingId} = ${userId} then ${follow.id} end)`.mapWith(
					Number,
				),
		})
		.from(user)
		.leftJoin(
			follow,
			or(eq(follow.followingId, userId), eq(follow.followerId, userId)),
		)
		.where(eq(user.id, userId))
		.groupBy(user.id);

	return profile;
}

export async function isFollowing(
	db: DB,
	input: {
		followerId: string;
		followingId: string;
	},
) {
	const { followerId, followingId } = input;

	const [result] = await db
		.select({ id: follow.id })
		.from(follow)
		.where(
			and(
				eq(follow.followerId, followerId),
				eq(follow.followingId, followingId),
			),
		);

	return {
		followId: result,
		isFollowing: !!result,
	};
}

// export async function getUserProfileByIdd(db: DB, userId: string) {
// 	const [profile] = await db
// 		.select({ id: user.id, name: user.name, image: user.image })
// 		.from(user)
// 		.where(eq(user.id, userId));

// 	return profile;
// }
