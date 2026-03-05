// import { useQuery } from "@tanstack/react-query";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ProfileView } from "../_components/profile/profile-view";

// export default async function ProfilePage({
export default async function ProfilePage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;

	prefetch(trpc.user.profile.queryOptions({ userId: id }));
	prefetch(trpc.tweet.profileFeed.queryOptions({ id: id }));
	prefetch(trpc.tweet.profileLikeFeed.queryOptions({ id: id }));

	return (
		<HydrateClient>
			{/* <ProfileView user={user} /> */}
			<ProfileView userId={id} />
		</HydrateClient>
	);
}
