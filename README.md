# The Yay News

Full-stack TypeScript monorepo: **pnpm + Turborepo**, **Next.js 16 + Tailwind CSS v4**,
**Hono** API, **PostgreSQL + Prisma 7**, with **zod** contracts shared end to end.

## Structure

```
apps/
  frontend/                 Next.js App Router (port 3000)
    src/
      app/                  routes, layouts, loading/error/not-found boundaries
      components/           app-wide components (site header, …)
      features/<feature>/   feature slices: api.ts (server-side data access) + components/
      lib/                  api client, formatting helpers
      config/env.ts         zod-validated env (server-only)
  backend/                  Hono REST API on Node (port 4000)
    src/
      index.ts              server bootstrap + graceful shutdown
      app.ts                createApp(): middleware, routes, error handling
      config/env.ts         zod-validated env
      modules/<module>/     *.routes.ts (HTTP) · *.service.ts (business rules) · *.repository.ts
                            (Prisma queries, where a module has them) · *.test.ts
      middleware/           error + not-found handlers
      lib/                  error classes, validation helper
packages/
  db/                       Prisma schema, migrations, seed + sample editions, shared `prisma` client (@repo/db)
  shared/                   zod schemas + inferred types used by both apps (@repo/shared)
  ui/                       shared Tailwind React components (@repo/ui/*)
  eslint-config/            shared ESLint configs
  typescript-config/        shared tsconfigs
```

Dependency direction: `frontend → shared, ui` · `backend → shared, db`. The frontend never touches the
database; it talks to the backend over HTTP and validates responses with the same zod schemas the
backend validates requests with.

## Getting started

Requires Node 24 (`.nvmrc`), pnpm 11 (`corepack enable`), and Docker.

```bash
pnpm install
cp packages/db/.env.example packages/db/.env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
pnpm db:up        # Postgres 17 in Docker
pnpm db:migrate   # apply migrations
pnpm db:seed      # sections + sample editions 38–45
pnpm dev          # frontend + backend with hot reload
```

Run the whole stack in containers instead:

```bash
docker compose --profile app up --build
```

## Scripts

| Script                                         | What                                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build`                      | all apps, via Turborepo                                                     |
| `pnpm lint` / `pnpm check-types` / `pnpm test` | quality gates (also run in CI)                                              |
| `pnpm format` / `pnpm format:check`            | Prettier, with Tailwind class sorting                                       |
| `pnpm db:up` / `pnpm db:down`                  | start/stop local Postgres                                                   |
| `pnpm db:generate`                             | regenerate the Prisma client (runs automatically before dev/build/test)     |
| `pnpm db:migrate`                              | create + apply a migration after editing `packages/db/prisma/schema.prisma` |
| `pnpm db:deploy`                               | apply pending migrations (production/CI)                                    |
| `pnpm db:seed` / `pnpm db:studio`              | wipe and reseed sections + sample editions / browse the database            |

## API

Responses are `{ "data": … }`; errors are `{ "error": { "code", "message", "details?" } }`. Response
shapes are the zod schemas in `packages/shared/src/schemas/`.

- `GET /health` — liveness
- `GET /health/ready` — readiness (checks the database)
- `GET /api/v1/editions/today` — the newest edition released to the reader
- `GET /api/v1/editions/:issue` — an edition by issue number
- `GET /api/v1/editions/date/:yyyy-mm-dd` — an edition by date
- `GET /api/v1/editions?cursor=<yyyy-mm-dd>&limit=<1-50>` — archive of released editions, newest
  first (summaries; pass `nextCursor` back as `cursor` for the next page)
- `GET /api/v1/editions/:issue/stories/:slug` — one story, its edition and page, and the previous/next
  story in reading order

**Release rule.** Edition _D_ is served once it is 07:00 on _D_ in the reader's timezone and its status
is `published` or `scheduled` (a scheduled edition releases itself); drafts and pulled editions are
never served. Until then every route above answers 404. The timezone comes from `?tz=<IANA zone>`,
else the `x-timezone` header, else UTC. Outside production, `?now=<ISO datetime>` moves the clock for
previews (those responses are `no-store`). Edition responses send `Vary: x-timezone`.

## Reader

The frontend reads every edition through the API and prints it in the edition's design and colourway
(`apps/frontend/src/features/papers/<design>/`).

- `/` — today's front page, for the reader's timezone (a `yn-tz` cookie set on first visit)
- `/issue/:n`, `/issue/:n/:section`, `/issue/:n/back` — an edition's pages
- `/issue/:n/story/:slug` — a story's own page, with the share bar
- `/issue/:n/print` — the whole edition, to print or save as PDF
- `/archive` — back issues
- `/clip/{story|post|link}?issue=:n&story=:slug` — clipping images (1080×1920, 1080×1350, 1200×630)
- `/mockups` — the Phase 1 design mockups and colour proofs

Outside production, add `?now=<ISO datetime>` to preview unreleased editions and
`&design=<broadsheet|tabloid|zine|midi>` to print any edition in another design.

## Adding a feature

1. Model it in `packages/db/prisma/schema.prisma`, then `pnpm db:migrate`.
2. Define its request/response schemas in `packages/shared/src/schemas/`.
3. Add `apps/backend/src/modules/<name>/` (routes, service, test) and mount it in `app.ts`.
4. Add `apps/frontend/src/features/<name>/` (api.ts + components) and a route under `src/app/`.
