# Frihedsbrevet - Editorial Tracker

Internal editorial workflow tracker built as a solution to the Frihedsbrevet test case.

## Features

- **Login with two roles**
  - _Editor_ — view and manage all content items.
  - _Contributor_ — view and manage only their own items.
  - Quick-login buttons in dev (one-click login with seeded users).
- **Dashboard** — list of content items, filterable by status (Idea / Draft / Review / Published). Shows author and deadline per item. Overdue deadlines highlighted.
- **Create content item** — dialog form on the dashboard.
- **Content detail page** (`/content/[id]`)
  - View item fields: title, body, author, type, status, deadline.
  - Edit item — native `<dialog>` form, status transitions restricted to the allowed flow.
  - Publish item — Editor-only, only when status is `Review`.
  - Archive item — soft delete (`archived: true`), removed from dashboard.
- **Status flow enforced server-side**: Idea → Draft → Review → Published. Last hop (Review → Published) is Editor-gated. Backward transitions are not permitted.
- **Role-based access**: Editor sees all unarchived items. Contributor sees only their own unarchived items. Enforcement at the data layer (server actions + queries), not just hidden UI.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [Prisma 7](https://www.prisma.io) + `better-sqlite3` (local SQLite)
- [next-auth 4](https://next-auth.js.org) — credentials provider, JWT sessions
- [Tailwind CSS 4](https://tailwindcss.com)
- [Biome 2](https://biomejs.dev) — formatting + linting
- [Bun](https://bun.sh) — package manager + runtime
- [TypeScript 5](https://www.typescriptlang.org)

## Prerequisites

- [Bun](https://bun.sh/docs/installation) 1.x

> The app and seed script both work under Node 20+ via `npm`. Bun is recommended for faster `install`/`dev` startup. For npm users, replace `bun` commands below with `npm` equivalents (e.g. `npm install`, `npm run prisma:migrate`, `npm run prisma:seed`, `npm run dev`).

## Getting Started

```bash
# 1. Install dependencies
bun install

# 2. Copy environment file
cp .env.example .env
# Edit .env: set DATABASE_URL (defaults to file:./dev.db) and generate
# NEXTAUTH_SECRET via: openssl rand -base64 32

# 3. Apply database migrations
bun run prisma:migrate

# 4. Seed test users + content items
bun run prisma:seed

# 5. Start the dev server
bun run dev
```

Open <http://localhost:3000> in your browser. You'll be redirected to `/login`.

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | SQLite connection string (file path). | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Random secret used to sign JWT sessions. Generate with `openssl rand -base64 32`. | `ibrDeYOAi2zm...` |

## Default Login Credentials

In **dev mode** (non-production), the login screen renders one-click quick-login buttons for the seeded users. For manual login:

| Username | Password | Role |
| --- | --- | --- |
| `Erik` | `test1234` | Editor |
| `Carl` | `test1234` | Contributor |

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server (after `build`) |
| `bun run lint` | Run Biome check |
| `bun run format` | Run Biome auto-fix |
| `bun run prisma:migrate` | Apply schema migrations to local SQLite |
| `bun run prisma:seed` | Seed test users + content items |
| `bun run prisma:studio` | Inspect/edit DB in browser (optional) |

## Project Structure

```
app/
  (auth)/login/      # login page + client form component
  actions/           # server actions (content CRUD: create/update/publish/archive)
  api/auth/          # next-auth route handler ([...nextauth])
  content/[id]/      # content detail page (dynamic route)
  layout.tsx         # root layout
  page.tsx           # dashboard (list + create dialog)
components/          # UI components (dialogs, list, items, menu, pills, dividers)
lib/                 # auth-options, prisma client, session helper, format helpers
prisma/              # schema.prisma + migrations + seed.ts + prisma.config.ts
proxy.ts             # next middleware (auth gate)
```

## Data Model

### `User`
| Field | Type | Notes |
| --- | --- | --- |
| id | String | cuid, primary key |
| username | String | unique, login handle |
| fullName | String | display name |
| password | String | stored plain (see assumptions) |
| role | Enum | `EDITOR` \| `CONTRIBUTOR` |

### `ContentItem`
| Field | Type | Notes |
| --- | --- | --- |
| id | String | cuid, primary key |
| title | String | |
| status | Enum | `Idea` \| `Draft` \| `Review` \| `Published` |
| type | Enum | `Article` \| `Video` \| `Podcast` \| `Other` |
| deadline | DateTime? | optional, overdue highlighted in UI |
| body | String? | optional, content body text |
| authorId | String | FK to User |
| archived | Boolean | default `false`, soft-delete flag |

## Assumptions & Decisions

1. **Plain-text passwords in the database.** Chose DB-stored plain passwords for simplicity. Production would require hashed passwords — out of scope for the case.
2. **Status flow enforcement added.** This solution enforces a linear flow `Idea → Draft → Review → Published` server-side. Last hop (Review → Published) is Editor-gated so items cannot skip review. Reasoning: reflects a real editorial review gate, protects against a contributor self-publishing.
3. **Archive = soft delete.** Chose `archived: Boolean @default(false)` over hard `DELETE` for reversibility and audit. Archived items filter out of the dashboard. No unarchive UI built — out of scope.
4. **Edit UI uses native `<dialog>` element.** No UI library (Radix/shadcn/etc.). Zero deps, accessible (focus trap, Esc-to-close, native backdrop), works without extra CSS. Chose over `<details>` for modal focus semantics and over Radix for YAGNI given the case's time budget.
5. **Backward status transitions forbidden.** Once an item moves to `Review` or `Published` it cannot be demoted from the UI. A real editorial workflow would have a "reject → back to Draft" path; skipped per YAGNI.
6. **SQLite file-based DB.** Zero-infra local run, no external service to install. Switching to another DB in production would require changes to the Prisma configuration (adapter, datasource, migrations) and the seed script — out of scope here.
7. **Quick-login dev helper.** Renders one-click login buttons when `NODE_ENV !== "production"` using the seeded users. Convenience for the case reviewer. Not a production pattern.
8. **No automated tests.** Not requested by the case and time-boxed.
9. **Session carries role + name via JWT callbacks.** `lib/auth-options.ts` jwt/session callbacks propagate `user.id` and `user.role` onto `session.user`. Pages read these directly off the session — avoids a redundant user fetch on every dashboard/detail render.
