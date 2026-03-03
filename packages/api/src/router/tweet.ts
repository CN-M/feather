import {
	CreateTweetSchema,
	createTweet,
	deleteTweet,
	getAllTweets,
	getTweetById,
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

	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input: { id } }) => {
			return getTweetById(ctx.db, id);
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
