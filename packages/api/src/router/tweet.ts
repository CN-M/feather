import { desc, eq } from "@feather/db";
import { tweet } from "@feather/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

export const CreateTweetSchema = z.object({
	content: z
		.string()
		.min(1, "Tweet cannot be empty")
		.max(280, "Tweet cannot exceed 280 characters"),
});

import { protectedProcedure, publicProcedure } from "../trpc";
// import { CreateTweetSchema } from "../schemas/tweet"; // wherever you put it

export const tweetRouter = {
	// Get latest tweets
	all: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.tweet.findMany({
			orderBy: desc(tweet.createdAt),
			limit: 20,
			with: {
				author: true,
				likes: true,
			},
		});
	}),

	// Get single tweet
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.db.query.tweet.findFirst({
				where: eq(tweet.id, input.id),
				with: {
					author: true,
					likes: true,
				},
			});
		}),

	// Create tweet
	create: protectedProcedure
		.input(CreateTweetSchema)
		.mutation(({ ctx, input }) => {
			return ctx.db.insert(tweet).values({
				content: input.content,
				authorId: ctx.session.user.id,
			});
		}),

	// Delete tweet
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => {
			return ctx.db.delete(tweet).where(eq(tweet.id, input.id));
		}),
} satisfies TRPCRouterRecord;
