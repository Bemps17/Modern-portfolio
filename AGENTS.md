# AGENTS.md

## Cursor Cloud specific instructions

Single Next.js 16 app (App Router) that serves three things on **one port `3000`**:
the public portfolio (`/`), the Payload CMS admin (`/admin`), and the Payload REST/GraphQL API (`/api`).
Standard commands live in `README.md` and `package.json` scripts — this section only
captures the non-obvious startup caveats for this VM.

### Database (Postgres) — required for the CMS/admin, not for the public site
- Postgres 16 is installed in the VM snapshot but is **not started automatically**. Start it each session:
  `sudo pg_ctlcluster 16 main start`
- A local DB `portfolio` (user `postgres` / password `postgres`) already exists in the snapshot.
- The app reads env from **`.env.local`** (gitignored). If it is missing, recreate it:
  ```
  DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/portfolio
  PAYLOAD_SECRET=<any long random string, e.g. `openssl rand -base64 32`>
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- The Payload Postgres adapter runs with `push: true` in dev, so the schema is auto-created/synced on first
  connect — no manual migration step. `pnpm test:int`'s `api.int.spec.ts` also needs this DB running.

### Demo mode vs full mode
- Without `PAYLOAD_SECRET` **and** `DATABASE_URI`, the app runs in **demo mode**: the public site + build work
  using `src/data/portfolio-fallback.ts`; `/admin`, the contact form, and content editing are disabled
  (see `src/lib/payload-env.ts`, `src/lib/content.ts`).

### Payload import map (admin rich-text)
- The committed `src/app/(payload)/admin/importMap.js` is stale (missing the Lexical rich-text components), which
  makes required rich-text fields (e.g. a Project's `Content`) fail to render in `/admin`. The update script runs
  `pnpm generate:importmap` (no DB needed) to regenerate it. Expect this file to show as modified in the working
  tree — that is the regenerated (correct) version; do not treat it as your change.

### Known pre-existing bug (blocks the public frontend)
- Every public page (`/`, `/projets`, `/a-propos`, `/contact`) currently returns **HTTP 500** because
  `src/components/layout/Header.tsx` renders `<Image src="/brand/favicon.png">` but `next.config.ts`
  `images.localPatterns` only allows `/api/media/file/**`. `/admin` and `/api` are unaffected.
  Fix (app-code change, out of scope for env setup): add `{ pathname: '/brand/**' }` to `images.localPatterns`
  (or use a plain `<img>` for the local logo).

### Media & email in local dev
- No `BLOB_READ_WRITE_TOKEN` → media uploads are stored on the local disk (Vercel Blob plugin stays off).
- No `RESEND_API_KEY` → Payload logs emails to the console instead of sending; the contact form still validates.
