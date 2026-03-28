import { toast } from "@feather/ui/toast";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export const FollowButton = ({
	followerId,
	followingId,
}: {
	followerId: string;
	followingId: string;
}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const {
		data: { followId, isFollowing },
	} = useSuspenseQuery(
		trpc.user.isFollowing.queryOptions({ followerId, followingId }),
	);

	const follow = useMutation(
		trpc.user.follow.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.user.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to follow someone"
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

	const unfollow = useMutation(
		trpc.user.unfollow.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.user.pathFilter());
			},
			onError: (err) => {
				toast.error(
					err.data?.code === "UNAUTHORIZED"
						? "You must be logged in to follow someone"
						: "Error following user",
				);
			},
		}),
	);

	return (
		<>
			{isFollowing && followId ? (
				<button
					type="button"
					onClick={() => unfollow.mutate({ followId: followId.id })}
					className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
					disabled={unfollow.isPending}
				>
					{unfollow.isPending ? "Unfollowing..." : "Unfollow"}
				</button>
			) : (
				<button
					type="button"
					onClick={() => follow.mutate({ followerId, followingId })}
					className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
					disabled={follow.isPending}
				>
					{follow.isPending ? "Following..." : "Follow"}
				</button>
			)}
		</>
	);
};
