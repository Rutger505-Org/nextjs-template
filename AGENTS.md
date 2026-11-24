# nextjs-template

Template repo for Rutger505-Org Next.js sites (rutgerpronk.com, relay, dijker-website, karaoke-type are created from it). Each of those has its own AGENTS.md with only its differences.

## Stack
- **Bun** (package manager + runtime), Next.js App Router, `output: "standalone"`
- **tRPC** + React Query (`src/server/api`, `src/trpc`), **Drizzle** on SQLite/libsql (`src/server/db`, migrations in `drizzle/`)
- **Better Auth**: email+password and magic links over SMTP (nodemailer), `src/server/auth.ts`
- **Env**: `src/env.ts` (t3 env + zod). New env var → add it there + `.env.example`
- Tailwind v4, shadcn/ui (new-york) in `src/components/ui`

## Commands
- Setup + dev: README "Development" (`cp .env.example .env`, `bun db:migrate`, `bun dev`)
- Checks (same as CI `code-quality.yaml`): `bun run lint` (0 warnings allowed), `bun run typecheck`
- Migrations: `bun db:generate -- --name "<name>"`, `bun db:migrate`. Bad migration: README "Migrations"

## Rules
- Branch + PR, never push to main. Conventional-commit PR titles (`feat:`, `fix(deploy):`, …), squash merge
- Verify locally (dev server, rendered pages) before pushing; the PR preview is not a test env

## Deploy
- `ci.yaml` → reusable `Rutger505-Org/kubernetes-infrastructure/.github/workflows/deployments.yaml@main` (Docker build/push, OpenTofu in `deploy/`, Tailscale into K3s). No local tofu/kubectl/docker needed
- **PR** opened/synced → preview at `https://pr-<N>.<BASE_DOMAIN>` (stable across pushes); closing destroys it
- **Push to main** → production at `<BASE_DOMAIN>`, image tagged with the commit sha. No path filters: every merge (also docs-only) redeploys prod. `workflow_dispatch` redeploys prod (e.g. after changing a var/secret)
- Repo vars/secrets prefixed `DEPLOYMENT_` reach the container with the prefix stripped; a secret wins over a variable, also an org secret over a repo variable. Required config: README "Using template"
- Org-level vars/secrets are only inherited by **public** repos
- New site: `gh repo create Rutger505-Org/<name> --template Rutger505-Org/nextjs-template --public`, set vars/secrets, then branch + PR

## Pitfalls
- Deploy succeeds but HTTP 500: usually a missing env var failing zod validation in `src/env.ts`; check pod logs
- `NEXT_PUBLIC_*` vars are inlined at build time; `DEPLOYMENT_` vars only exist at runtime, so they can't set them (set them in the Dockerfile builder stage)
- Prod detection in `deploy/` OpenTofu: `terraform.workspace == "production"` (workspaces `production` / `pr-<N>`), not `certificate_issuer` (all envs use letsencrypt-production)
- Fresh preview briefly serves Traefik's default cert; retry before debugging TLS
- Namespaces `<APPLICATION_NAME>-production` / `<APPLICATION_NAME>-pr-<N>`; migrations run in an init container (`bun db:migrate`); SQLite on a PVC. OpenTofu lock stuck: delete the Lease (`deploy/README.md`)
- "Failed to find Server Action" in prod: prod still runs an older build; check the merge's deploy run
- `next/font/google` fetches fonts at build time and can fail on CI runners; rutgerpronk.com and dijker-website switched to `next/font/local`
- Fixes here don't propagate: derived repos are copies, port changes to them by hand
- Features on external data (APIs, feeds, lyrics): inspect the raw response first
