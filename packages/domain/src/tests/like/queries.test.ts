import { beforeEach, describe, expect, it } from "vitest";
import { getTweetsLikedByProfile } from "../../tweet/queries";
import { createMockDb, type MockDb } from "../mock-db";

const makeMockLikeWithTweet = (overrides = {}) => ({
	id: crypto.randomUUID(),
	userId: "user-1",
	tweetId: "tweet-1",
	createdAt: new Date(),
	tweet: {
		id: "tweet-1",
		content: "Hello world",
		createdAt: new Date("2024-01-01T00:00:00Z"),
		author: { id: "user-2", name: "Bob", image: null },
		likes: [],
	},
	...overrides,
});

describe("getTweetsLikedByProfile", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("returns empty tweets and null cursor when user has no likes", async () => {
		db.query.like.findMany.mockResolvedValue([]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.tweets).toHaveLength(0);
		expect(result.nextCursor).toBeNull();
	});

	it("maps liked tweets correctly with likeCount", async () => {
		const mockLikes = [
			makeMockLikeWithTweet({
				tweet: {
					id: "tweet-1",
					content: "Hello world",
					createdAt: new Date(),
					author: { id: "user-2", name: "Bob", image: null },
					likes: [{ id: "like-1" }, { id: "like-2" }],
				},
			}),
		];
		db.query.like.findMany.mockResolvedValue(mockLikes);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.tweets).toHaveLength(1);
		expect(result.tweets[0]?.likeCount).toBe(2);
		expect(result.tweets[0]?.content).toBe("Hello world");
	});

	it("sets nextCursor when exactly 20 results", async () => {
		const lastDate = new Date("2024-01-20T00:00:00Z");
		const mockLikes = Array.from({ length: 20 }, (_, i) =>
			makeMockLikeWithTweet({
				tweet: {
					id: `tweet-${i}`,
					content: `Tweet ${i}`,
					createdAt: i === 19 ? lastDate : new Date(),
					author: { id: "user-2", name: "Bob", image: null },
					likes: [],
				},
			}),
		);
		db.query.like.findMany.mockResolvedValue(mockLikes);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.nextCursor).toEqual(lastDate);
	});

	it("returns null cursor when fewer than 20 results", async () => {
		db.query.like.findMany.mockResolvedValue([makeMockLikeWithTweet()]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.nextCursor).toBeNull();
	});

	it("includes author info on each tweet", async () => {
		db.query.like.findMany.mockResolvedValue([
			makeMockLikeWithTweet({
				tweet: {
					id: "tweet-1",
					content: "Test",
					createdAt: new Date(),
					author: {
						id: "user-2",
						name: "Bob",
						image: "https://example.com/avatar.jpg",
					},
					likes: [],
				},
			}),
		]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.tweets[0]?.author.name).toBe("Bob");
		expect(result.tweets[0]?.author.image).toBe(
			"https://example.com/avatar.jpg",
		);
	});
});
