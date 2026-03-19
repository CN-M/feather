import { beforeEach, describe, expect, it } from "vitest";
import {
	getAllTweets,
	getProfileFeedbyId,
	getTweetById,
} from "../../tweet/queries";
import { createMockDb, type MockDb, makeMockTweet } from "../mock-db";

describe("getAllTweets", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("returns empty tweets and null cursor when no results", async () => {
		db.limit.mockResolvedValue([]);

		const result = await getAllTweets(db);

		expect(result.tweets).toHaveLength(0);
		expect(result.nextCursor).toBeNull();
	});

	it("returns tweets when results exist", async () => {
		const mockTweets = [makeMockTweet(), makeMockTweet(), makeMockTweet()];
		db.limit.mockResolvedValue(mockTweets);

		const result = await getAllTweets(db);

		expect(result.tweets).toHaveLength(3);
		expect(result.tweets[0]?.content).toBe("Hello world");
	});

	it("sets nextCursor to last tweet createdAt when exactly 20 results", async () => {
		const lastDate = new Date("2024-06-01T00:00:00Z");
		const mockTweets = Array.from({ length: 20 }, (_, i) =>
			makeMockTweet({
				createdAt: i === 19 ? lastDate : new Date(),
			}),
		);
		db.limit.mockResolvedValue(mockTweets);

		const result = await getAllTweets(db);

		expect(result.nextCursor).toEqual(lastDate);
	});

	it("returns null cursor when fewer than 20 results", async () => {
		db.limit.mockResolvedValue(
			Array.from({ length: 5 }, () => makeMockTweet()),
		);

		const result = await getAllTweets(db);

		expect(result.nextCursor).toBeNull();
	});

	it("passes cursor to query when provided", async () => {
		db.limit.mockResolvedValue([]);
		const cursor = new Date("2024-01-01T00:00:00Z");

		await getAllTweets(db, "", cursor);

		expect(db.where).toHaveBeenCalled();
	});

	it("calls where with undefined when no cursor provided", async () => {
		db.limit.mockResolvedValue([]);

		await getAllTweets(db);

		expect(db.where).toHaveBeenCalledWith(undefined);
	});
});

describe("getTweetById", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("returns null when tweet not found", async () => {
		db.query.tweet.findFirst.mockResolvedValue(null);

		const result = await getTweetById(db, "nonexistent-id");

		expect(result).toBeNull();
	});

	it("returns tweet with author and likes when found", async () => {
		const mockTweet = {
			id: "tweet-1",
			content: "Hello world",
			createdAt: new Date(),
			author: { id: "user-1", name: "Alice", image: null },
			likeCount: 1,
		};
		db.query.tweet.findFirst.mockResolvedValue(mockTweet);

		const result = await getTweetById(db, "tweet-1");

		expect(result).toEqual(mockTweet);
		expect(result?.author.name).toBe("Alice");
		expect(result?.likeCount).toBe(1);
	});

	it("calls findFirst with correct tweet id", async () => {
		await getTweetById(db, "tweet-abc");

		expect(db.query.tweet.findFirst).toHaveBeenCalled();
	});
});

describe("getProfileFeedbyId", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("returns empty tweets and null cursor when user has no tweets", async () => {
		db.limit.mockResolvedValue([]);

		const result = await getProfileFeedbyId(db, "user-1");

		expect(result.tweets).toHaveLength(0);
		expect(result.nextCursor).toBeNull();
	});

	it("returns tweets for the given user", async () => {
		const mockTweets = [
			makeMockTweet({ author: { id: "user-1", name: "Alice", image: null } }),
			makeMockTweet({ author: { id: "user-1", name: "Alice", image: null } }),
		];
		db.limit.mockResolvedValue(mockTweets);

		const result = await getProfileFeedbyId(db, "user-1");

		expect(result.tweets).toHaveLength(2);
	});

	it("sets nextCursor when exactly 20 results returned", async () => {
		const lastDate = new Date("2024-03-01T00:00:00Z");
		const mockTweets = Array.from({ length: 20 }, (_, i) =>
			makeMockTweet({ createdAt: i === 19 ? lastDate : new Date() }),
		);
		db.limit.mockResolvedValue(mockTweets);

		const result = await getProfileFeedbyId(db, "user-1");

		expect(result.nextCursor).toEqual(lastDate);
	});

	it("returns null cursor when fewer than 20 results", async () => {
		db.limit.mockResolvedValue(
			Array.from({ length: 3 }, () => makeMockTweet()),
		);

		const result = await getProfileFeedbyId(db, "user-1");

		expect(result.nextCursor).toBeNull();
	});
});
