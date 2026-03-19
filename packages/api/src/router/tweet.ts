import {
	CreateTweetSchema,
	createTweet,
	deleteTweet,
	getAllTweets,
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
		// .input(z.object({ cursor: z.date().optional() }).optional())
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

	profileLikeFeed: publicProcedure
		.input(z.object({ profileId: z.string(), cursor: z.date().optional() }))
		// .input(z.object({ profileId: z.string() }))
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
		.input(z.object({ tweetId: z.string(), userId: z.string() }))
		.mutation(({ ctx, input }) => {
			return likeTweet(ctx.db, input);
		}),

	unlike: protectedProcedure
		.input(z.object({ likeId: z.string(), userId: z.string() }))
		.mutation(({ ctx, input }) => {
			return unlikeTweet(ctx.db, input);
		}),

	create: protectedProcedure
		.input(CreateTweetSchema)
		.mutation(({ ctx, input: { content } }) => {
			console.log({ session: ctx.session });

			return createTweet(ctx.db, {
				content: content,
				authorId: ctx.session.user.id,
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input: { id } }) => {
			return deleteTweet(ctx.db, id);
		}),
} satisfies TRPCRouterRecord;
