import { relations } from "drizzle-orm";
import { index, pgTable, unique } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { like, tweet } from "./tweet-schema";

// Follow Table (relationships between users)
export const follow = pgTable(
	"follow",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		followerId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		followingId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: t.timestamp().notNull().defaultNow(),
	}),
	(table) => ({
		// Prevent duplicate follows
		uniqueFollow: unique("unique_follow").on(
			table.followerId,
			table.followingId,
		),
		// Index for "who does this user follow?"
		followerIdIdx: index("follow_follower_id_idx").on(table.followerId),
		// Index for "who follows this user?"
		followingIdIdx: index("follow_following_id_idx").on(table.followingId),
	}),
);

// Relations

export const userRelations = relations(user, ({ many }) => ({
	tweets: many(tweet),
	likes: many(like),
	// Users I follow
	following: many(follow, { relationName: "follower" }),
	// Users who follow me
	followers: many(follow, { relationName: "following" }),
}));

export const followRelations = relations(follow, ({ one }) => ({
	follower: one(user, {
		fields: [follow.followerId],
		references: [user.id],
		relationName: "follower",
	}),
	following: one(user, {
		fields: [follow.followingId],
		references: [user.id],
		relationName: "following",
	}),
}));
