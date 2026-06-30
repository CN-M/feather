# 🐦 Feather – Phase 1 Execution Plan

**Goal:**
Build a production-minded Twitter-like app with clean domain boundaries, type-safe APIs, and a deployable AWS setup — without scope creep.

---

## 🗓 Phase 1 – Foundation & Setup

### Repo & Tooling

* [X] Initialize repo using `create-t3-turbo`
* [X] Verify pnpm workspace setup
* [X] Clean unused packages / boilerplate
* [X] Commit initial scaffold

### Environment & Config

* [X] Configure env validation
* [ ] Set up SST project
* [ ] Configure AWS credentials
* [X] Set up Postgres (local + prod)
* [X] Add Drizzle ORM
* [ ] Configure migrations

### Database Schema (Phase 1)

* [X] User table
* [X] Tweet table
* [X] Follow table
* [X] Like table
* [X] Add indexes (authorId, createdAt)
* [ ] Run first migration
* [X] Seed script (basic users)

### Auth (Better Auth)

* [X] Configure Better Auth
* [X] Email/password auth
* [X] Session handling
* [] Auth helpers (`requireUser`)
* [] Protected tRPC context

**End of Phase Check**

* [X] App runs locally
* [X] Auth works
* [X] DB connected
* [X] Can log in

---

## 🗓 Phase 2 – Domain Layer & Core Data Logic

### Domain Structure

* [X] Create `packages/domain`
* [X] Add `tweet` domain folder
* [X] Add `user` domain folder

### Tweet Domain

* [X] `createTweet`
* [X] `deleteTweet`
* [X] `likeTweet`
* [X] `unlikeTweet`
* [X] Validation (length, ownership)

### User / Follow Domain

* [X] `followUser`
* [X] `unfollowUser`
* [X] `getUserProfile`
* [X] `getFollowerCounts`

### Timeline Queries

* [X] Global feed query
* [X] Following feed query
* [X] Profile feed query
* [X] Cursor-based pagination

### Guardrails

* [X] Ownership checks
* [X] Duplicate like protection
* [X] Follow self prevention

**End of Phase Check**

* [X] Domain logic tested manually
* [X] No UI yet, just correctness
* [X] Domain layer has no Next.js imports

---

## 🗓 Phase 3 – tRPC API Layer

### tRPC Setup

* [X] Configure base tRPC router
* [X] Auth-aware context
* [ ] Error handling strategy

### Tweet Router

* [X] `getGlobalFeed`
* [ ] `getUserFeed`
* [X] `createTweet`
* [X] `deleteTweet`
* [x] `likeTweet`
* [x] `unlikeTweet`

### User / Follow Router

* [X] `getProfile`
* [X] `followUser`
* [X] `unfollowUser`
* [X] `getFollowerCounts`

### Validation

* [ ] Zod input schemas
* [ ] Cursor types
* [X] Protected procedures

### API Stability

* [ ] No UI assumptions in responses
* [ ] Versionable router structure

**End of Phase Check**

* [ ] tRPC calls work via playground
* [x] Auth enforcement works
* [x] Pagination works

---

## 🗓 Phase 4 – Web UI (Main Twitter Experience)

### Layout & Navigation

* [x] App layout shell
* [ ] Auth-protected routes
* [x] Header / nav
* [x] Mobile responsiveness

### Home Feed

* [X] Feed page
* [X] Infinite scroll
* [X] Loading skeletons
* [X] Empty state

### Tweet Interactions

* [X] Create tweet form
* [ ] Like / unlike
* [X] Delete own tweet
* [ ] Optimistic updates

### Profile Page

* [X] Profile header
* [X] Follow / unfollow button
* [X] Profile feed
* [X] Follower counts

**End of Phase Check**

* [ ] App feels “Twitter-like”
* [ ] No console errors
* [ ] UX is clean, not fancy

---

## 🗓 Phase 5 – Polish, Tooling & Deployment

### Error Handling & UX

* [ ] Graceful error states
* [ ] Disabled states for mutations
* [ ] Loading indicators everywhere
* [ ] Basic accessibility checks

### Tooling Extras (Pick 2–3)

* [X] DB reset script
* [X] Seed users script
* [ ] Simple Playwright test
* [X] Typed env validation
* [X] ESLint / formatting polish

### Deployment

* [ ] SST deploy to AWS
* [ ] Prod DB connected
* [ ] Environment variables verified
* [ ] Smoke test live app

### Documentation

* [X] README overview
* [ ] Architecture diagram (text is fine)
* [X] Future extensibility section
* [X] CV-ready project description

**End of Phase Check**

* [X] App is live
* [ ] README explains decisions
* [ ] Scope stayed controlled
