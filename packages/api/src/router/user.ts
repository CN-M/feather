import { getTweetsLikedByUser } from "@feather/domain/tweet";
import {
	createFollow,
	deleteFollow,
	getUserProfileById,
	isFollowing,
} from "@feather/domain/user";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
	profile: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ ctx, input: { userId } }) => {
			const profile = await getUserProfileById(ctx.db, userId);
			if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
			return profile;
		}),

	profileLikes: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(({ ctx, input: { userId } }) => {
			return getTweetsLikedByUser(ctx.db, userId);
		}),

	isFollowing: protectedProcedure
		.input(z.object({ followerId: z.string(), followingId: z.string() }))
		.query(({ ctx, input }) => {
			return isFollowing(ctx.db, input);
		}),

	follow: protectedProcedure
		.input(z.object({ followerId: z.string(), followingId: z.string() }))
		.mutation(({ ctx, input }) => {
			return createFollow(ctx.db, input);
		}),

	unfollow: protectedProcedure
		.input(z.object({ followId: z.string() }))
		.mutation(({ ctx, input }) => {
			return deleteFollow(ctx.db, input);
		}),
} satisfies TRPCRouterRecord;
