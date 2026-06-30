"use client";

import { Button } from "@feather/ui/button";
import { toast } from "@feather/ui/toast";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { authClient } from "~/auth/client";

import { useTRPC } from "~/trpc/react";

const CreateTweetSchema = z.object({
	content: z
		.string()
		.min(1, "Tweet cannot be empty")
		.max(280, "Tweet cannot exceed 280 characters"),
});

export function CreateTweetForm({
	parentId,
	placeholder = "What's happening?",
	submitLabel = "Tweet",
}: {
	parentId?: string;
	placeholder?: string;
	submitLabel?: string;
} = {}) {
	const [userAvatar, setUserAvatar] = useState<null | string>(null);
	const [userName, setUserName] = useState<null | string>(null);

	useEffect(() => {
		const getUserAvatar = async () => {
			const { data } = await authClient.getSession();

			if (data?.user.image) setUserAvatar(data?.user.image);
			if (data?.user.name) setUserName(data?.user.name);
		};

		getUserAvatar();
	});

	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const createTweet = useMutation(
		trpc.tweet.create.mutationOptions({
			onSuccess: async () => {
				form.reset();
				await queryClient.invalidateQueries(trpc.tweet.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to tweet"
						: "Failed to create tweet",
				);
			},
			// onMutate: async ({ content }) => {
			// 	await queryClient.cancelQueries(trpc.tweet.pathFilter());

			// 	const prevTweets = queryClient.getQueryData(trpc.tweet.all.queryKey());

			// 	queryClient.setQueryData(trpc.tweet.all.queryKey(), (prev) => {
			// 		if (!prev) return prev;

			// 		return {
			// 			tweets: [
			// 				{
			// 					id: `optimistic-${Date.now()}`,
			// 					content: content,
			// 					createdAt: new Date(),
			// 					updatedAt: new Date(),
			// 					author: {
			// 					}
			// 				},
			// 				...prev,
			// 			],
			// 			nextCursor: null,
			// 		};
			// 	});

			// 	return { prevTweets };
			// },
		}),
	);

	const form = useForm({
		defaultValues: {
			content: "",
		},
		validators: {
			onSubmit: CreateTweetSchema,
		},
		onSubmit: (data) =>
			createTweet.mutate({ content: data.value.content, parentId }),
	});

	return (
		<form
			className="w-full max-w-2xl border-b border-border px-4 py-5"
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<div className="flex gap-4">
				<div className="shrink-0">
					{userAvatar ? (
						<div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/10">
							<Image
								src={userAvatar}
								fill
								alt={userName ?? "User avatar"}
								className="object-cover"
								sizes="40px"
							/>
						</div>
					) : (
						<div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
							{userName?.[0] ?? "U"}
						</div>
					)}
				</div>

				<div className="flex w-full flex-col">
					<form.Field
						name="content"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<>
									<textarea
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={placeholder}
										maxLength={280}
										className="resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
										rows={3}
									/>

									{/* Bottom Bar */}
									<div className="mt-3 flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											{field.state.value.length}/280
										</span>

										<Button
											type="submit"
											size="sm"
											disabled={createTweet.isPending}
										>
											{createTweet.isPending ? "Posting..." : submitLabel}
										</Button>
									</div>

									{isInvalid && (
										<p className="mt-2 text-xs text-destructive">
											{field.state.meta.errors.join(", ")}
										</p>
									)}
								</>
							);
						}}
					/>
				</div>
			</div>
		</form>
	);
}
