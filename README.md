# ReleaseCheck

A small release checklist tool. Track releases through a fixed 7-step checklist; each release's status (`planned` / `ongoing` / `done`) is computed automatically from how many steps are checked.

- **Backend**: Node.js + Express + Prisma + PostgreSQL, in `backend/`
- **Frontend**: React (Vite) single-page app + React Router, in `frontend/`
- **Deployment**: backend on Render, frontend on Vercel, database on a hosted Postgres instance

## Architecture

Both sides are layered so each piece can be replaced without touching the others.

**Backend** (`backend/src/`):
- `routes/` — HTTP only: parses the request, calls a service, sends the response
- `services/` — business logic (status computation, validation); no DB or HTTP awareness, so it's trivial to unit test
- `repositories/` — the only layer that talks to Prisma/Postgres
- `constants/steps.js` — the fixed list of 7 checklist steps (see [Database schema](#database-schema) for why this isn't a DB table)

**Frontend** (`frontend/src/`):
- `api/` — the only code that knows the backend's URL/response shape
- `components/` — presentational, receive data/handlers as props
- `pages/` — data fetching + composition of components

## Running locally

### With Docker (backend + database)

```bash
docker compose up --build
```

This starts Postgres and the API (`http://localhost:4000`). On first run, generate the initial migration once from the host:

```bash
cd backend
DATABASE_URL="postgresql://app:app@localhost:5432/release_checklist?schema=public" npx prisma migrate dev --name init
```

(Subsequent starts just apply existing migrations automatically via `prisma migrate deploy`, which runs as part of the container's start command.)

Then run the frontend separately:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173`.

### Without Docker

Backend:

```bash
cd backend
cp .env.example .env   # set DATABASE_URL to your Postgres instance
npm install
npx prisma migrate dev --name init
npm run dev             # http://localhost:4000
```

Frontend:

```bash
cd frontend
cp .env.example .env.local   # set VITE_API_URL if backend isn't on localhost:4000
npm install
npm run dev                   # http://localhost:5173
```

## API endpoints

All routes are prefixed with `/api`. Bodies/responses are JSON.

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/health` | — | Liveness check (not under `/api`) |
| GET | `/api/steps` | — | The fixed, ordered checklist step definitions (`key`, `label`, `order`) |
| GET | `/api/releases` | — | List all releases, each with computed `status` and full step state |
| POST | `/api/releases` | `{ name, releaseDate, additionalInfo? }` | Create a release, seeded with all steps unchecked |
| GET | `/api/releases/:id` | — | Fetch a single release |
| PATCH | `/api/releases/:id` | `{ additionalInfo }` | Update a release's notes |
| PATCH | `/api/releases/:id/steps/:stepKey` | `{ completed }` | Check/uncheck one checklist step |
| DELETE | `/api/releases/:id` | — | Delete a release |

A release response looks like:

```json
{
  "id": "uuid",
  "name": "Version 1.0.0",
  "releaseDate": "2026-09-15T10:00:00.000Z",
  "additionalInfo": "notes",
  "status": "ongoing",
  "steps": [
    { "key": "prs-merged", "label": "All relevant GitHub pull requests have been merged", "order": 1, "completed": true },
    ...
  ]
}
```

## Database schema

```
releases
  id                uuid, primary key
  name              text, not null
  release_date      timestamptz, not null
  additional_info   text, nullable
  created_at        timestamptz, default now()
  updated_at        timestamptz, auto-updated

release_steps
  release_id        uuid, references releases(id) on delete cascade
  step_key          text
  completed         boolean, default false
  primary key (release_id, step_key)
```

Status (`planned` / `ongoing` / `done`) is **not stored** — it's computed on every read from the step completion counts (see `backend/src/services/releaseService.js`).

The 7 checklist steps themselves are **not a database table**: they're identical for every release, so they live as a fixed list in `backend/src/constants/steps.js`. Each release just tracks completion state per step key.

## Deployment

- **API** → Render, deployed from `backend/Dockerfile` (Render auto-detects it — set the service's root directory to `backend`). Set `DATABASE_URL` to the hosted Postgres instance as an env var. The container's start command already runs `prisma migrate deploy` before starting the server, so schema setup happens automatically on deploy.
- **Frontend** → Vercel, with `VITE_API_URL` set to the deployed API's `/api` URL (e.g. `https://your-api.onrender.com/api`). `frontend/vercel.json` adds the SPA rewrite so client-side routes work on direct load.
- **Database** → any hosted PostgreSQL instance (e.g. Render Postgres, Neon, Supabase).
