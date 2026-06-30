import { beforeEach, describe, expect, it } from "vitest";
import { getTweetsLikedByProfile } from "../../tweet/queries";
import { createMockDb, type MockDb, makeMockTweet } from "../mock-db";

describe("getTweetsLikedByProfile", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("returns empty tweets and null cursor when user has no likes", async () => {
		db.limit.mockResolvedValue([]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.tweets).toHaveLength(0);
		expect(result.nextCursor).toBeNull();
	});

	it("maps liked tweets correctly with likeCount", async () => {
		db.limit.mockResolvedValue([
			makeMockTweet({ id: "tweet-1", content: "Hello world", likeCount: 2 }),
		]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.tweets).toHaveLength(1);
		expect(result.tweets[0]?.likeCount).toBe(2);
		expect(result.tweets[0]?.content).toBe("Hello world");
	});

	it("sets nextCursor when exactly 20 results", async () => {
		const lastDate = new Date("2024-01-20T00:00:00Z");
		db.limit.mockResolvedValue(
			Array.from({ length: 20 }, (_, i) =>
				makeMockTweet({
					id: `tweet-${i}`,
					createdAt: i === 19 ? lastDate : new Date(),
				}),
			),
		);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.nextCursor).toEqual(lastDate);
	});

	it("returns null cursor when fewer than 20 results", async () => {
		db.limit.mockResolvedValue([makeMockTweet()]);

		const result = await getTweetsLikedByProfile(db, "user-1");

		expect(result.nextCursor).toBeNull();
	});

	it("includes author info on each tweet", async () => {
		db.limit.mockResolvedValue([
			makeMockTweet({
				author: {
					id: "user-2",
					name: "Bob",
					image: "https://example.com/avatar.jpg",
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
