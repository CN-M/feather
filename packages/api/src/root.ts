import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { tweetRouter } from "./router/tweet";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	post: postRouter,
	tweet: tweetRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
