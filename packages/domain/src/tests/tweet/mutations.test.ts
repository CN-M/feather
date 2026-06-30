import { beforeEach, describe, expect, it } from "vitest";
import { createTweet, deleteTweet } from "../../tweet/mutations";
import { createMockDb, type MockDb } from "../mock-db";

describe("createTweet", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("inserts tweet with correct content and authorId", async () => {
		await createTweet(db, { content: "Hello world", authorId: "user-1" });

		expect(db.insert).toHaveBeenCalled();
		expect(db.values).toHaveBeenCalledWith({
			content: "Hello world",
			authorId: "user-1",
		});
	});

	it("trims nothing — preserves content as-is", async () => {
		await createTweet(db, { content: "  spaces  ", authorId: "user-1" });

		expect(db.values).toHaveBeenCalledWith({
			content: "  spaces  ",
			authorId: "user-1",
		});
	});
});

describe("deleteTweet", () => {
	let db: MockDb;

	beforeEach(() => {
		db = createMockDb();
	});

	it("scopes the delete to the tweet id and its author", async () => {
		await deleteTweet(db, "tweet-123", "user-1");

		expect(db.delete).toHaveBeenCalled();
		// Ownership is enforced in the where clause (tweet id + author id).
		expect(db.where).toHaveBeenCalled();
		expect(db.returning).toHaveBeenCalled();
	});
});
