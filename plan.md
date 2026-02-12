# 🐦 Feather – Phase 1 Execution Plan

**Goal:**
Build a production-minded Twitter-like app with clean domain boundaries, type-safe APIs, and a deployable AWS setup — without scope creep.

---

## 🗓 Phase 1 – Foundation & Setup

### Repo & Tooling

* [ ] Initialize repo using `create-t3-turbo`
* [ ] Verify pnpm workspace setup
* [ ] Clean unused packages / boilerplate
* [ ] Commit initial scaffold

### Environment & Config

* [ ] Configure env validation
* [ ] Set up SST project
* [ ] Configure AWS credentials
* [ ] Set up Postgres (local + prod)
* [ ] Add Drizzle ORM
* [ ] Configure migrations

### Database Schema (Phase 1)

* [ ] User table
* [ ] Tweet table
* [ ] Follow table
* [ ] Like table
* [ ] Add indexes (authorId, createdAt)
* [ ] Run first migration
* [ ] Seed script (basic users)

### Auth (Better Auth)

* [ ] Configure Better Auth
* [ ] Email/password auth
* [ ] Session handling
* [ ] Auth helpers (`requireUser`)
* [ ] Protected tRPC context

**End of Phase Check**

* [ ] App runs locally
* [ ] Auth works
* [ ] DB connected
* [ ] Can log in

---

## 🗓 Phase 2 – Domain Layer & Core Data Logic

### Domain Structure

* [ ] Create `packages/domain`
* [ ] Add `tweet` domain folder
* [ ] Add `user` domain folder
* [ ] Add `follow` domain folder

### Tweet Domain

* [ ] `createTweet`
* [ ] `deleteTweet`
* [ ] `likeTweet`
* [ ] `unlikeTweet`
* [ ] Validation (length, ownership)

### User / Follow Domain

* [ ] `followUser`
* [ ] `unfollowUser`
* [ ] `getUserProfile`
* [ ] `getFollowerCounts`

### Timeline Queries

* [ ] Global feed query
* [ ] Profile feed query
* [ ] Cursor-based pagination

### Guardrails

* [ ] Ownership checks
* [ ] Duplicate like protection
* [ ] Follow self prevention

**End of Phase Check**

* [ ] Domain logic tested manually
* [ ] No UI yet, just correctness
* [ ] Domain layer has no Next.js imports

---

## 🗓 Phase 3 – tRPC API Layer

### tRPC Setup

* [ ] Configure base tRPC router
* [ ] Auth-aware context
* [ ] Error handling strategy

### Tweet Router

* [ ] `getGlobalFeed`
* [ ] `getUserFeed`
* [ ] `createTweet`
* [ ] `deleteTweet`
* [ ] `likeTweet`
* [ ] `unlikeTweet`

### User / Follow Router

* [ ] `getProfile`
* [ ] `followUser`
* [ ] `unfollowUser`
* [ ] `getFollowerCounts`

### Validation

* [ ] Zod input schemas
* [ ] Cursor types
* [ ] Protected procedures

### API Stability

* [ ] No UI assumptions in responses
* [ ] Versionable router structure

**End of Phase Check**

* [ ] tRPC calls work via playground
* [ ] Auth enforcement works
* [ ] Pagination works

---

## 🗓 Phase 4 – Web UI (Main Twitter Experience)

### Layout & Navigation

* [ ] App layout shell
* [ ] Auth-protected routes
* [ ] Header / nav
* [ ] Mobile responsiveness

### Home Feed

* [ ] Feed page
* [ ] Infinite scroll
* [ ] Loading skeletons
* [ ] Empty state

### Tweet Interactions

* [ ] Create tweet form
* [ ] Like / unlike
* [ ] Delete own tweet
* [ ] Optimistic updates

### Profile Page

* [ ] Profile header
* [ ] Follow / unfollow button
* [ ] Profile feed
* [ ] Follower counts

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

* [ ] DB reset script
* [ ] Seed users script
* [ ] Simple Playwright test
* [ ] Typed env validation
* [ ] ESLint / formatting polish

### Deployment

* [ ] SST deploy to AWS
* [ ] Prod DB connected
* [ ] Environment variables verified
* [ ] Smoke test live app

### Documentation

* [ ] README overview
* [ ] Architecture diagram (text is fine)
* [ ] Future extensibility section
* [ ] CV-ready project description

**End of Phase Check**

* [ ] App is live
* [ ] README explains decisions
* [ ] Scope stayed controlled
