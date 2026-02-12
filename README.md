# 🐦 Feather

**Feather** is a modern, production-minded **Twitter clone** built to showcase scalable full-stack architecture, clean domain boundaries, and real-world development practices.

The goal of Feather is not to recreate every Twitter feature, but to build a **strong, extensible social platform foundation** that can grow into additional products such as an admin dashboard, mobile clients, public APIs, and real-time features.

---

## ✨ Features (Phase 1)

- User authentication (email/password)
- Create, like, and delete tweets
- Global timeline and user profile feeds
- Follow / unfollow users
- Cursor-based pagination
- Optimistic UI updates
- Fully type-safe API
- Responsive, accessible UI

---

## 🧠 Architecture Overview

Feather is built as a **type-safe, domain-oriented monolith** with clear separation between:

- **Domain logic** (business rules)
- **API layer** (tRPC)
- **Web UI** (Next.js)
- **Infrastructure** (AWS via SST)

This structure allows the same core logic to be reused across:
- Web app
- Future admin dashboard
- Future mobile apps
- Future public APIs

---

## 🏗️ Tech Stack

### Core Platform
- **Next.js (App Router)** – Web application framework
- **React** – UI rendering
- **TypeScript** – End-to-end type safety
- **tRPC** – Type-safe API layer
- **Drizzle ORM** – Database access & migrations
- **Neon Postgres** – Serverless PostgreSQL database
- **Better Auth** – Authentication & sessions
- **Tailwind CSS** – Styling

### Infrastructure & Deployment
- **AWS** – Cloud infrastructure
- **SST** – Serverless deployment & infrastructure management

### Developer Experience & Quality
- **CI pipelines** – Automated builds & checks
- **Pre-commit hooks** – Enforced via Lefthook
- **Linting & formatting** – Powered by Biome
- **Strict env validation**
- **Consistent code standards**

_(DX tooling is intentionally lightweight and automated to keep focus on correctness and maintainability.)_

---

## 📁 Project Structure (High Level)

```
apps/
web/          # Next.js web app
packages/
db/           # Drizzle schema & migrations
domain/       # Core business logic
trpc/         # API routers & procedures
auth/         # Authentication configuration
```


---

## 🗺️ Roadmap

### Phase 1 – Core Twitter Experience (Current)
- [ ] Auth (Gmail Login/email + Password)
- [ ] Tweets (create, like, delete)
- [ ] Global feed
- [ ] Profile feed
- [ ] Follow / unfollow
- [ ] Cursor pagination
- [ ] AWS deployment
- [ ] CI + code quality automation

### Phase 2 – Platform Expansion
- [ ] Admin dashboard
- [ ] Public API
- [ ] Mobile client support
- [ ] Search
- [ ] Notifications

### Phase 3 – Real-Time & Social Depth
- [ ] Direct messages (DMs)
- [ ] Realtime updates
- [ ] Media uploads
- [ ] Rate limiting & abuse protection

---

## 🎯 Project Goals

Feather is designed to demonstrate:

- Intentional architecture decisions
- Clean separation of concerns
- Scalable data access patterns
- Production-ready tooling
- Cloud-native deployment practices

It prioritizes **clarity, correctness, and extensibility** over feature bloat.

---

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
````

Environment variables are validated at startup.
See `.env.example` for required configuration.

---

## 📄 License

MIT