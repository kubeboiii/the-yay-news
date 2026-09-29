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
      modules/<module>/     *.routes.ts (HTTP) · *.service.ts (data/business logic) · *.test.ts
      middleware/           error + not-found handlers
      lib/                  error classes, validation helper
packages/
  db/                       Prisma schema, migrations, seed, shared `prisma` client (@repo/db)
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
pnpm db:seed      # sample articles
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
| `pnpm db:seed` / `pnpm db:studio`              | seed data / browse the database                                             |

## API

Responses are `{ "data": … }`; errors are `{ "error": { "code", "message", "details?" } }`.

- `GET /health` — liveness
- `GET /health/ready` — readiness (checks the database)
- `GET /api/v1/articles?category=<slug>&limit=<1-100>`
- `GET /api/v1/articles/:slug`

## Adding a feature

1. Model it in `packages/db/prisma/schema.prisma`, then `pnpm db:migrate`.
2. Define its request/response schemas in `packages/shared/src/schemas/`.
3. Add `apps/backend/src/modules/<name>/` (routes, service, test) and mount it in `app.ts`.
4. Add `apps/frontend/src/features/<name>/` (api.ts + components) and a route under `src/app/`.
