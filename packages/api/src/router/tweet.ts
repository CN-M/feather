import {
	CreateTweetSchema,
	createTweet,
	deleteTweet,
	getAllTweets,
	getTweetById,
	getTweetsLikedByUser,
	getUserProfileFeedbyId,
	likeTweet,
	unlikeTweet,
} from "@feather/domain/tweet";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = {
	all: publicProcedure
		.input(z.object({ cursor: z.date().optional() }).optional())
		.query(({ ctx, input }) => {
			return getAllTweets(ctx.db, input?.cursor);
		}),

	profileFeed: publicProcedure
		// .input(z.object({ id: z.string() }))
		.input(z.object({ id: z.string(), cursor: z.date().optional() }))
		.query(({ ctx, input: { id } }) => {
			return getUserProfileFeedbyId(ctx.db, id);
		}),

	profileLikeFeed: publicProcedure
		.input(z.object({ id: z.string(), cursor: z.date().optional() }))
		// .input(z.object({ id: z.string() }))
		.query(({ ctx, input: { id } }) => {
			return getTweetsLikedByUser(ctx.db, id);
		}),

	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input: { id } }) => {
			return getTweetById(ctx.db, id);
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
