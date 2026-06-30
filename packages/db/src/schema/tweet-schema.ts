import { relations, sql } from "drizzle-orm";
import { type AnyPgColumn, index, pgTable, unique } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const tweet = pgTable(
	"tweet",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		content: t.varchar({ length: 280 }).notNull(), // Twitter's character limit
		authorId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		// Self-reference: a reply points at the tweet it replies to. Null for
		// top-level tweets. Cascade so deleting a tweet removes its replies.
		parentId: t.uuid().references((): AnyPgColumn => tweet.id, {
			onDelete: "cascade",
		}),
		createdAt: t.timestamp().notNull().defaultNow(),
		updatedAt: t
			.timestamp({ withTimezone: true })
			.$onUpdateFn(() => sql`now()`),
	}),
	(table) => ({
		// Index for fetching tweets by author (profile feed)
		authorIdIdx: index("tweet_author_id_idx").on(table.authorId),
		// Index for global feed ordering
		createdAtIdx: index("tweet_created_at_idx").on(table.createdAt),
		// Composite index for efficient author + time queries
		authorCreatedIdx: index("tweet_author_created_idx").on(
			table.authorId,
			table.createdAt,
		),
		// Index for fetching a tweet's replies (thread view)
		parentIdIdx: index("tweet_parent_id_idx").on(table.parentId),
	}),
);

// Like Table (tweet likes)
export const like = pgTable(
	"like",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		userId: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		tweetId: t
			.uuid()
			.notNull()
			.references(() => tweet.id, { onDelete: "cascade" }),
		createdAt: t.timestamp().notNull().defaultNow(),
	}),
	(table) => ({
		// Prevent duplicate likes
		uniqueLike: unique("unique_like").on(table.userId, table.tweetId),
		// Index for "all likes by this user"
		userIdIdx: index("like_user_id_idx").on(table.userId),
		// Index for "all likes on this tweet"
		tweetIdIdx: index("like_tweet_id_idx").on(table.tweetId),
	}),
);

// ============================================================================
// RELATIONS (for Drizzle relational queries)
// ============================================================================
export const tweetRelations = relations(tweet, ({ one, many }) => ({
	author: one(user, {
		fields: [tweet.authorId],
		references: [user.id],
	}),
	parent: one(tweet, {
		fields: [tweet.parentId],
		references: [tweet.id],
		relationName: "tweet_replies",
	}),
	replies: many(tweet, { relationName: "tweet_replies" }),
	likes: many(like),
}));

export const likeRelations = relations(like, ({ one }) => ({
	user: one(user, {
		fields: [like.userId],
		references: [user.id],
	}),
	tweet: one(tweet, {
		fields: [like.tweetId],
		references: [tweet.id],
	}),
}));
