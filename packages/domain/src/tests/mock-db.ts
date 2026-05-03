import { vi } from "vitest";

export function createMockDb() {
	const mockLimit = vi.fn().mockResolvedValue([]);
	const mockReturning = vi.fn().mockResolvedValue([]);
	const mockWhere = vi.fn().mockReturnThis();

	return {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: mockWhere,
		innerJoin: vi.fn().mockReturnThis(),
		leftJoin: vi.fn().mockReturnThis(),
		groupBy: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: mockLimit,
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		onConflictDoNothing: vi.fn().mockReturnThis(),
		returning: mockReturning,
		delete: vi.fn().mockReturnThis(),
		query: {
			tweet: {
				findFirst: vi.fn().mockResolvedValue(null),
			},
			like: {
				findMany: vi.fn().mockResolvedValue([]),
			},
		},
		// biome-ignore lint/suspicious/noExplicitAny: Allows Flexibility
	} as any;
}

export type MockDb = ReturnType<typeof createMockDb>;

// Reusable mock data factories
export const makeMockTweet = (overrides = {}) => ({
	id: crypto.randomUUID(),
	content: "Hello world",
	createdAt: new Date("2024-01-01T00:00:00Z"),
	author: { id: "user-1", name: "Alice", image: null },
	likeCount: 0,
	...overrides,
});

export const makeMockLike = (overrides = {}) => ({
	id: crypto.randomUUID(),
	userId: "user-1",
	tweetId: "tweet-1",
	createdAt: new Date("2024-01-01T00:00:00Z"),
	...overrides,
});

export const makeMockUser = (overrides = {}) => ({
	id: "user-1",
	name: "Alice",
	image: null,
	...overrides,
});
