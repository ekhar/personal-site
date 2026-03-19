# erickhar.com Monorepo

## Structure
- `apps/blog` — Next.js static export, erickhar.com
- `apps/dashboard` — Next.js SSR + Supabase, personal.erickhar.com
- `packages/ui` — shadcn/ui component library (Tailwind v4, Radix, lucide-react)
- `packages/supabase` — Supabase project: migrations, seed, generated types, client helpers
- `packages/content` — MDX blog posts + interactive components + WASM
- `packages/typescript-config` — Shared tsconfigs

## Conventions
- **Package manager**: bun (workspaces, no Turborepo)
- **Linting/formatting**: biome (tabs, single quotes, trailing commas)
- **Styling**: Tailwind CSS v4 via `@erickhar/ui`
- **Database**: Supabase JS client only — no Drizzle, no raw Postgres driver
- **Auth**: Supabase Auth via `@supabase/ssr` — single-user, no registration flow
- **Blog content**: MDX in `packages/content/posts/`
- **Imports**: Use `@erickhar/*` workspace package names

## Commands
- `bun install` — install all workspace deps
- `bun run dev:blog` — run blog dev server
- `bun run dev:dashboard` — run dashboard dev server
- `bun run build:blog` — static export to `apps/blog/out/`
- `bun run build:dashboard` — build dashboard
- `bun run lint` — biome check
- `supabase start` — local Supabase (run from `packages/supabase/`)
- `supabase gen types typescript --local > src/database.types.ts` — regenerate types
