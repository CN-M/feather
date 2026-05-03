import {
	CreateTweetSchema,
	createTweet,
	deleteTweet,
	getAllTweets,
	getFollowFeed,
	getProfileFeedbyId,
	getTweetById,
	getTweetsLikedByProfile,
	likeTweet,
	unlikeTweet,
} from "@feather/domain/tweet";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = {
	all: publicProcedure
		.input(z.object({ cursor: z.date().optional() }))
		.query(({ ctx, input: { cursor } }) => {
			return getAllTweets(ctx.db, ctx.session?.user.id, cursor);
		}),

	profileFeed: publicProcedure
		.input(
			z.object({
				profileId: z.string(),
				cursor: z.date().optional(),
			}),
		)
		.query(({ ctx, input: { profileId, cursor } }) => {
			return getProfileFeedbyId(
				ctx.db,
				profileId,
				ctx.session?.user.id,
				cursor,
			);
		}),

	following: protectedProcedure
		.input(
			z.object({
				cursor: z.date().optional(),
			}),
		)
		.query(({ ctx, input: { cursor } }) => {
			return getFollowFeed(ctx.db, ctx.session?.user.id, cursor);
		}),

	profileLikeFeed: publicProcedure
		.input(z.object({ profileId: z.string(), cursor: z.date().optional() }))
		.query(({ ctx, input: { profileId, cursor } }) => {
			return getTweetsLikedByProfile(
				ctx.db,
				profileId,
				ctx.session?.user.id,
				cursor,
			);
		}),

	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input: { id } }) => {
			return getTweetById(ctx.db, id, ctx.session?.user.id);
		}),

	like: protectedProcedure
		.input(z.object({ tweetId: z.string() }))
		.mutation(({ ctx, input: { tweetId } }) => {
			// Always act as the authenticated user — never trust a client-supplied id.
			return likeTweet(ctx.db, { tweetId, userId: ctx.session.user.id });
		}),

	unlike: protectedProcedure
		.input(z.object({ tweetId: z.string() }))
		.mutation(({ ctx, input: { tweetId } }) => {
			return unlikeTweet(ctx.db, { tweetId, userId: ctx.session.user.id });
		}),

	create: protectedProcedure
		.input(CreateTweetSchema)
		.mutation(({ ctx, input: { content } }) => {
			return createTweet(ctx.db, {
				content: content,
				authorId: ctx.session.user.id,
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input: { id } }) => {
			return deleteTweet(ctx.db, id, ctx.session.user.id);
		}),
} satisfies TRPCRouterRecord;
