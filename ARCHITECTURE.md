# Feather — Architecture Rundown

**Feather** is a Twitter/X clone built as a **type-safe, domain-oriented monolith** in a `create-t3-turbo` monorepo. It's a portfolio/production-minded project meant to be a foundation that can later grow admin dashboards, mobile clients, and public APIs.

## Monorepo layout (pnpm + Turborepo)
```
apps/
  web/        Next.js (App Router) web app — main frontend
  mobile/     Expo / React Native client (secondary)
packages/
  domain/     Pure business logic (queries/mutations/schemas) — DB-agnostic, unit-tested
  api/        tRPC routers (auth, user, tweet, post) — the API layer
  db/         Drizzle ORM schema + migrations (Neon Postgres)
  auth/       Better Auth setup (email/password sessions)
  ui/         Shared UI components + icons (Tailwind)
  validators/ Shared Zod validation schemas
tooling/      Shared config (eslint/biome/tsconfig etc.)
```

## Architecture principle
Clear separation of layers so core logic is reused everywhere:
- **`domain/`** holds business rules as plain functions (`tweet/queries.ts`, `tweet/mutations.ts`, `user/...`), tested against a **mock DB** (`tests/mock-db.ts`) — no real database needed for unit tests.
- **`api/`** (tRPC) wires domain logic into type-safe endpoints.
- **`web/`** (Next.js App Router) consumes tRPC with end-to-end type safety and optimistic UI updates.
- **`db/`** defines schema (`auth-schema`, `user-schema`, `tweet-schema`) via Drizzle.

## Tech stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **API:** tRPC (fully type-safe)
- **DB:** Drizzle ORM + Neon serverless Postgres
- **Auth:** Better Auth (email/password)
- **Infra:** AWS via SST (serverless deployment)
- **Tooling:** TypeScript (strict), Biome (lint/format), Lefthook (pre-commit hooks), Turborepo, pnpm workspaces, domain unit tests, strict env validation

## Features (Phase 1)
- Email/password auth & sessions
- Create / like / delete tweets (with enforced ownership + idempotent likes)
- Global timeline, per-user profile feeds, and a following feed
- Follow / unfollow users
- Cursor-based pagination
- Optimistic UI updates
- Tweet detail pages (`/tweet/[id]`)

## Useful commands
- `pnpm dev` / `pnpm dev:web` — run all / web only
- `pnpm db:push | db:seed | db:studio | db:reset` — Drizzle DB ops
- `pnpm typecheck | lint | check` — quality gates (run via Turbo)

## Notes
- There's both a `tweet.ts` and a legacy `post.ts` router; `post` is leftover t3 scaffold.
