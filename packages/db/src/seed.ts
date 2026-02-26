import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
// import { user, account } from "./schema/auth-schema";
import { account, follow, like, tweet, user } from "./schema/index";

// ---------------------------------------------------------------------------
// CONFIG - update POSTGRES_URL or use your env
// ---------------------------------------------------------------------------
const connectionString = env.POSTGRES_URL;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { casing: "snake_case" });

// ---------------------------------------------------------------------------
// CAST OF CHARACTERS
// Since you use Google auth, users need an account row too.
// These are fake users — IDs are deterministic so re-running is idempotent.
// ---------------------------------------------------------------------------
const USERS = [
	{
		id: "seed-user-1",
		name: "Gary the Senior Dev",
		email: "gary@devlife.fake",
		image: null,
	},
	{
		id: "seed-user-2",
		name: "Priya the PM",
		email: "priya@roadmap.fake",
		image: null,
	},
	{
		id: "seed-user-3",
		name: "Chad Frontend",
		email: "chad@tailwind.fake",
		image: null,
	},
	{
		id: "seed-user-4",
		name: "Linda from QA",
		email: "linda@itbrokeinprod.fake",
		image: null,
	},
	{
		id: "seed-user-5",
		name: "Kevin the Intern",
		email: "kevin@pushed2main.fake",
		image: null,
	},
] as const;

// ---------------------------------------------------------------------------
// TWEETS
// ---------------------------------------------------------------------------
const TWEETS: { authorId: string; content: string }[] = [
	// Gary the Senior Dev
	{
		authorId: "seed-user-1",
		content:
			"just spent 4 hours debugging. the bug was a missing semicolon. i have a masters degree",
	},
	{
		authorId: "seed-user-1",
		content:
			"they asked me to 'just add a quick feature'. it's been 3 sprints. i live here now",
	},
	{
		authorId: "seed-user-1",
		content:
			"the codebase is so old it references a library whose author is dead. RIP Gerald. your npm package lives on",
	},
	{
		authorId: "seed-user-1",
		content:
			"works on my machine (my machine is a 2019 macbook pro with 64gb ram and the will to lie)",
	},
	{
		authorId: "seed-user-1",
		content:
			"wrote a comment saying 'don't touch this or everything breaks'. someone touched it. everything broke. this is my villain origin story",
	},

	// Priya the PM
	{
		authorId: "seed-user-2",
		content:
			"the stakeholders want it done by friday. it is currently thursday 4:47pm. i have made peace with god",
	},
	{
		authorId: "seed-user-2",
		content:
			"exciting update: we are pivoting. again. for the fourth time this quarter. the north star is wherever the CEO's cousin points",
	},
	{
		authorId: "seed-user-2",
		content:
			"just moved 47 tickets from 'In Progress' to 'Blocked' and felt absolutely nothing",
	},
	{
		authorId: "seed-user-2",
		content:
			"the MVP is ready. by MVP i mean we hardcoded everything and prayed. ship it",
	},
	{
		authorId: "seed-user-2",
		content:
			"syncing with engineering to discuss capacity. they laughed. why did they laugh. why are they still laughing",
	},

	// Chad Frontend
	{
		authorId: "seed-user-3",
		content:
			"updated the button radius by 2px. filed a JIRA ticket. wrote a migration guide. sent a company-wide email. called it a design system overhaul",
	},
	{
		authorId: "seed-user-3",
		content:
			"tailwind cult member here. i write 40-class divs and i am at peace",
	},
	{
		authorId: "seed-user-3",
		content:
			"the designer sent me a figma file with 14 different shades of white and said 'you'll know which one'. i do not know which one",
	},
	{
		authorId: "seed-user-3",
		content:
			"spent a day making the loading spinner 'feel more premium'. it now costs $0.0003 more per render. worth it",
	},
	{
		authorId: "seed-user-3",
		content:
			"my entire job is to make rectangles look slightly different from other rectangles and honestly? thriving",
	},

	// Linda from QA
	{
		authorId: "seed-user-4",
		content:
			"found a critical bug in production. was told it's 'a feature'. i have screenshots. i have logs. i have nothing",
	},
	{
		authorId: "seed-user-4",
		content:
			"the test suite is green. the app is on fire. these are unrelated according to the dev who wrote the tests",
	},
	{
		authorId: "seed-user-4",
		content:
			"opened a ticket marked P0. it was triaged to P3. it came back as a P0 incident three weeks later. the cycle of life",
	},
	{
		authorId: "seed-user-4",
		content:
			"they skipped QA 'just this once' to hit a deadline. that was six months ago. we have been living in 'just this once' ever since",
	},
	{
		authorId: "seed-user-4",
		content:
			"reproduction steps: 1. breathe on the app 2. click anything 3. it's broken. please advise",
	},

	// Kevin the Intern
	{
		authorId: "seed-user-5",
		content:
			"just pushed directly to main!! someone told me not to do that. i will not be doing that again",
	},
	{
		authorId: "seed-user-5",
		content:
			"asked a question in slack and the answer was a link to the docs. the docs linked back to the slack message. i am going in circles",
	},
	{
		authorId: "seed-user-5",
		content:
			"my first PR has 47 comments. i fixed one of them and opened 3 new conversations. this is going great",
	},
	{
		authorId: "seed-user-5",
		content:
			"dropped the production database in a standup demo. there were 12 people watching. i have left my body",
	},
	{
		authorId: "seed-user-5",
		content:
			"day 3: i have learned what a linter is. day 4: i hate the linter. day 5: i respect the linter",
	},
];

// ---------------------------------------------------------------------------
// FOLLOWS - make it a real social network (chaotic)
// ---------------------------------------------------------------------------
const FOLLOWS = [
	// Kevin follows everyone desperately
	{ followerId: "seed-user-5", followingId: "seed-user-1" },
	{ followerId: "seed-user-5", followingId: "seed-user-2" },
	{ followerId: "seed-user-5", followingId: "seed-user-3" },
	{ followerId: "seed-user-5", followingId: "seed-user-4" },
	// Gary follows no one (senior dev energy)
	// Priya follows Gary and Linda (she needs them)
	{ followerId: "seed-user-2", followingId: "seed-user-1" },
	{ followerId: "seed-user-2", followingId: "seed-user-4" },
	// Chad follows Chad (himself, conceptually — only Chad)
	{ followerId: "seed-user-3", followingId: "seed-user-5" }, // mentoring the intern
	// Linda follows everyone because she needs to watch them
	{ followerId: "seed-user-4", followingId: "seed-user-1" },
	{ followerId: "seed-user-4", followingId: "seed-user-2" },
	{ followerId: "seed-user-4", followingId: "seed-user-3" },
	{ followerId: "seed-user-4", followingId: "seed-user-5" },
];

// ---------------------------------------------------------------------------
// SEED
// ---------------------------------------------------------------------------
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

	// Likes - sprinkle some chaos
	console.log("❤️  Adding likes...");
	const likePairs: { userId: string; tweetId: string }[] = [];
	for (const t of insertedTweets) {
		// Everyone likes Kevin's disaster tweets
		if (t.authorId === "seed-user-5") {
			for (const u of USERS) {
				if (u.id !== t.authorId) {
					likePairs.push({ userId: u.id, tweetId: t.id });
				}
			}
		}
		// Linda likes every Gary tweet (she knows)
		if (t.authorId === "seed-user-1") {
			likePairs.push({ userId: "seed-user-4", tweetId: t.id });
		}
		// Kevin likes everything (eager intern)
		if (t.authorId !== "seed-user-5") {
			likePairs.push({ userId: "seed-user-5", tweetId: t.id });
		}
	}

	if (likePairs.length > 0) {
		await db.insert(like).values(likePairs).onConflictDoNothing();
	}

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
