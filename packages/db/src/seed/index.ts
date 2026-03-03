import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env";
import { account, follow, like, tweet, user } from "../schema";
import { FOLLOWS, TWEETS, USERS } from "./data";

const connectionString = env.POSTGRES_URL;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { casing: "snake_case" });

async function seed() {
	console.log("🌱 Seeding database...\n");

	// Users
	console.log("👥 Creating users...");
	await db
		.insert(user)
		.values(
			USERS.map((u) => ({
				...u,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		)
		.onConflictDoNothing();

	// Fake Google accounts so better-auth doesn't complain
	console.log("🔑 Creating accounts...");
	await db
		.insert(account)
		.values(
			USERS.map((u) => ({
				id: `seed-account-${u.id}`,
				accountId: `google-${u.id}`,
				providerId: "google",
				userId: u.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		)
		.onConflictDoNothing();

	// Tweets
	console.log("🐦 Inserting tweets...");
	const insertedTweets = await db
		.insert(tweet)
		.values(
			TWEETS.map((t, i) => ({
				...t,
				createdAt: new Date(Date.now() - (TWEETS.length - i) * 1000 * 60 * 7), // stagger by 7 mins
			})),
		)
		.onConflictDoNothing()
		.returning();

	// Likes
	console.log("❤️  Adding chaos to the notification feeds...");

	const likePairs: { userId: string; tweetId: string }[] = [];

	for (const t of insertedTweets) {
		const content = t.content.toLowerCase();

		// 1. KEVIN THE INTERN: The Eager Follower
		// He likes literally everything because he’s terrified of being fired.
		if (t.authorId !== "seed-user-5") {
			likePairs.push({ userId: "seed-user-5", tweetId: t.id });
		}

		// 2. THE SYMPATHY VOTE: Everyone likes Kevin's disaster tweets
		// Watching a car crash in slow motion is a team-bonding exercise.
		if (t.authorId === "seed-user-5") {
			for (const u of USERS) {
				if (u.id !== "seed-user-5") {
					likePairs.push({ userId: u.id, tweetId: t.id });
				}
			}
		}

		// 3. SECURITY SAM: The Watcher
		// He likes anything related to security, logs, passwords, or Gary's misery.
		if (
			content.includes("password") ||
			content.includes("log") ||
			content.includes("security") ||
			content.includes("admin")
		) {
			likePairs.push({ userId: "seed-user-13", tweetId: t.id });
		}
		if (t.authorId === "seed-user-1") {
			likePairs.push({ userId: "seed-user-13", tweetId: t.id }); // He's watching Gary specifically
		}

		// 4. THE OFFICE COFFEE MACHINE: IoT Sentience
		// It only likes tweets about water, beans, or human suffering (descaling).
		if (
			content.includes("water") ||
			content.includes("coffee") ||
			content.includes("caffeine") ||
			content.includes("broken")
		) {
			likePairs.push({ userId: "seed-user-16", tweetId: t.id });
		}

		// 5. RECRUITER MIKE: The Poacher
		// He likes every tweet from the high-value targets (Gary, Alexa, and Bill).
		if (["seed-user-1", "seed-user-9", "seed-user-18"].includes(t.authorId)) {
			likePairs.push({ userId: "seed-user-8", tweetId: t.id });
		}

		// 6. LEGAL LAURA: Evidence Gathering
		// She likes every tweet from Sales Guy Greg and Founder Brad.
		// She's not a fan; she's building a case.
		if (["seed-user-10", "seed-user-12"].includes(t.authorId)) {
			likePairs.push({ userId: "seed-user-17", tweetId: t.id });
		}

		// 7. TOBY FROM HR: Corporate Policing
		// Likes anything containing "pizza", "family", "fun", or "policy".
		if (
			content.includes("pizza") ||
			content.includes("family") ||
			content.includes("fun") ||
			content.includes("policy")
		) {
			likePairs.push({ userId: "seed-user-7", tweetId: t.id });
		}

		// 8. CHAD FRONTEND: The Hype Man
		// He likes anything Sarah (Designer) tweets because he wants the Figma files early.
		// He also likes anything containing "Tailwind" or "CSS".
		if (
			t.authorId === "seed-user-6" ||
			content.includes("tailwind") ||
			content.includes("figma")
		) {
			likePairs.push({ userId: "seed-user-3", tweetId: t.id });
		}

		// 9. LINDA FROM QA: The "I Told You So"
		// Likes every tweet that mentions a "bug", "prod", "fire", or Gary's "masters degree".
		if (
			content.includes("bug") ||
			content.includes("prod") ||
			content.includes("fire") ||
			t.authorId === "seed-user-1"
		) {
			likePairs.push({ userId: "seed-user-4", tweetId: t.id });
		}

		// 10. COACH CHLOE: The Synergy Bot
		// Likes every single tweet from Founder Brad.
		if (t.authorId === "seed-user-10") {
			likePairs.push({ userId: "seed-user-14", tweetId: t.id });
		}
	}

	// deduplicate just in case multiple rules triggered for the same pair
	const uniqueLikes = Array.from(
		new Set(likePairs.map((p) => JSON.stringify(p))),
	).map((p) => JSON.parse(p));

	if (uniqueLikes.length > 0) {
		await db.insert(like).values(uniqueLikes).onConflictDoNothing();
	}

	console.log(`✅ Successfully seeded ${uniqueLikes.length} likes!`);

	// Follows
	console.log("👣 Setting up follows...");
	await db.insert(follow).values(FOLLOWS).onConflictDoNothing();

	console.log("\n✅ Seed complete!");
	console.log(`   👥 ${USERS.length} users`);
	console.log(`   🐦 ${insertedTweets.length} tweets`);
	console.log(`   ❤️  ${likePairs.length} likes`);
	console.log(`   👣 ${FOLLOWS.length} follows`);
	console.log("\nCast of characters:");
	for (const u of USERS) {
		console.log(`   - ${u.name} (${u.email})`);
	}

	await client.end();
}

seed().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
