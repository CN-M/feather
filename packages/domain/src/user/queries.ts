import { alias, and, type DB, eq, sql } from "@feather/db";
import { follow, user } from "@feather/db/schema";

const following = alias(follow, "following");
const followers = alias(follow, "followers");
const myFollow = alias(follow, "myFollow");

export async function getProfileById(
	db: DB,
	profileId: string,
	userId?: string,
) {
	const [profile] = await db
		.select({
			id: user.id,
			name: user.name,
			image: user.image,
			followingCount: sql<number>`count(distinct ${following.id})`.mapWith(
				Number,
			),
			followerCount: sql<number>`count(distinct ${followers.id})`.mapWith(
				Number,
			),
			isFollowing: sql<boolean>`bool_or(${myFollow.id} is not null)`.mapWith(
				Boolean,
			),
		})
		.from(user)
		.leftJoin(following, eq(following.followerId, profileId))
		.leftJoin(followers, eq(followers.followingId, profileId))
		.leftJoin(
			myFollow,
			and(
				eq(myFollow.followerId, userId ?? ""),
				eq(myFollow.followingId, profileId),
			),
		)
		.where(eq(user.id, profileId))
		.groupBy(user.id)
		.limit(1);

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
