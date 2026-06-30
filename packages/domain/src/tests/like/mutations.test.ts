import { beforeEach, describe, expect, it } from "vitest";
import { likeTweet, unlikeTweet } from "../../tweet/mutations";
import { createMockDb, type MockDb, makeMockLike } from "../mock-db";

describe("likeTweet", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("inserts like with correct tweetId and userId", async () => {
		db.returning.mockResolvedValue([makeMockLike()]);

		await likeTweet(db, { tweetId: "tweet-1", userId: "user-1" });

		expect(db.insert).toHaveBeenCalled();
		expect(db.values).toHaveBeenCalledWith({
			tweetId: "tweet-1",
			userId: "user-1",
		});
	});

	it("returns the created like with id, tweetId, userId", async () => {
		const mockLike = makeMockLike({
			id: "like-123",
			tweetId: "tweet-1",
			userId: "user-1",
		});
		db.returning.mockResolvedValue([mockLike]);

		const result = await likeTweet(db, {
			tweetId: "tweet-1",
			userId: "user-1",
		});

		expect(result[0]?.id).toBe("like-123");
		expect(result[0]?.tweetId).toBe("tweet-1");
		expect(result[0]?.userId).toBe("user-1");
	});

	it("returns empty array when insert fails silently", async () => {
		db.returning.mockResolvedValue([]);

		const result = await likeTweet(db, {
			tweetId: "tweet-1",
			userId: "user-1",
		});

		expect(result).toHaveLength(0);
	});

	it("is idempotent — a duplicate like is a no-op via onConflictDoNothing", async () => {
		await likeTweet(db, { tweetId: "tweet-1", userId: "user-1" });

		expect(db.onConflictDoNothing).toHaveBeenCalled();
	});
});

describe("unlikeTweet", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("deletes the like matching the tweetId and userId", async () => {
		db.returning.mockResolvedValue([makeMockLike({ id: "like-123" })]);

		await unlikeTweet(db, { tweetId: "tweet-1", userId: "user-1" });

		expect(db.delete).toHaveBeenCalled();
		expect(db.where).toHaveBeenCalled();
	});

	it("returns the deleted like", async () => {
		const mockLike = makeMockLike({
			id: "like-123",
			tweetId: "tweet-1",
			userId: "user-1",
		});
		db.returning.mockResolvedValue([mockLike]);

		const result = await unlikeTweet(db, {
			tweetId: "tweet-1",
			userId: "user-1",
		});

		expect(result[0]?.id).toBe("like-123");
	});

	it("returns empty array when the like does not exist", async () => {
		db.returning.mockResolvedValue([]);

		const result = await unlikeTweet(db, {
			tweetId: "tweet-1",
			userId: "nonexistent",
		});

		expect(result).toHaveLength(0);
	});
});
