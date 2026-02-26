"use client";

import type { RouterOutputs } from "@feather/api";
import { cn } from "@feather/ui";
import { Button } from "@feather/ui/button";
import { toast } from "@feather/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

type Tweet = RouterOutputs["tweet"]["all"][number];

export function TweetCard({ tweet }: { tweet: Tweet }) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();

	const deleteTweet = useMutation(
		trpc.tweet.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.tweet.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to delete a tweet"
						: "Failed to delete tweet",
				);
			},
		}),
	);

	const isAuthor = session?.user.id === tweet.authorId;

	return (
		<div className="group relative flex w-full gap-4 border-b border-border px-4 py-5 transition-colors hover:bg-muted/40">
			{/* Avatar */}
			<div className="shrink-0">
				<div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
					{tweet.author?.name?.[0] ?? "U"}
				</div>
			</div>

			{/* Content */}
			<div className="flex w-full flex-col">
				{/* Header */}
				<div className="flex items-center gap-2">
					<span className="font-semibold text-sm">
						{tweet.author?.name ?? "Unknown"}
					</span>
					<span className="text-xs text-muted-foreground">
						· {new Date(tweet.createdAt).toLocaleDateString()}
					</span>

					{isAuthor && (
						<Button
							variant="ghost"
							size="icon"
							className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => deleteTweet.mutate({ id: tweet.id })}
							disabled={deleteTweet.isPending}
						>
							✕
						</Button>
					)}
				</div>

				{/* Body */}
				<p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
					{tweet.content}
				</p>

				{/* Actions */}
				<div className="mt-4 flex items-center gap-6 text-muted-foreground text-xs">
					<button
						type="button"
						className="hover:text-primary transition-colors"
					>
						❤️ {tweet.likes?.length ?? 0}
					</button>
				</div>
			</div>
		</div>
	);
}

export function TweetCardSkeleton({ pulse = true }: { pulse?: boolean }) {
	return (
		<div className="flex w-full gap-4 border-b border-border px-4 py-5">
			{/* Avatar */}
			<div
				className={cn(
					"h-10 w-10 shrink-0 rounded-full bg-muted",
					pulse && "animate-pulse",
				)}
			/>

			{/* Content */}
			<div className="flex w-full flex-col gap-3">
				{/* Header row */}
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"h-4 w-24 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
					<div
						className={cn(
							"h-3 w-16 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
				</div>

				{/* Body lines */}
				<div
					className={cn("h-4 w-5/6 rounded bg-muted", pulse && "animate-pulse")}
				/>
				<div
					className={cn("h-4 w-2/3 rounded bg-muted", pulse && "animate-pulse")}
				/>

				{/* Action row */}
				<div className="mt-2 flex gap-6">
					<div
						className={cn(
							"h-3 w-12 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
					<div
						className={cn(
							"h-3 w-12 rounded bg-muted",
							pulse && "animate-pulse",
						)}
					/>
				</div>
			</div>
		</div>
	);
}
