import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ProfileView } from "../_components/profile/profile-view";

export default async function ProfilePage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;

	await Promise.all([
		prefetch(trpc.user.profile.queryOptions({ profileId: id })),
		prefetch(trpc.tweet.profileFeed.queryOptions({ profileId: id })),
		prefetch(trpc.tweet.profileLikeFeed.queryOptions({ profileId: id })),
	]);

	return (
		<HydrateClient>
			<ProfileView profileId={id} />
		</HydrateClient>
	);
}
