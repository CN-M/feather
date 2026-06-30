import { z } from "zod";

export const CreateTweetSchema = z.object({
	content: z
		.string()
		.min(1, "Tweet cannot be empty")
		.max(280, "Tweet cannot exceed 280 characters"),
	// When present, the new tweet is a reply to this tweet.
	parentId: z.string().uuid().optional(),
});

export type CreateTweetInput = z.infer<typeof CreateTweetSchema>;
