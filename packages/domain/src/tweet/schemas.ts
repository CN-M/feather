import { z } from "zod";

export const CreateTweetSchema = z.object({
	content: z
		.string()
		.min(1, "Tweet cannot be empty")
		.max(280, "Tweet cannot exceed 280 characters"),
});

export type CreateTweetInput = z.infer<typeof CreateTweetSchema>;
