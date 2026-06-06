# Deploying GTPROJECT Backend to Render (single all-in-one service)

You chose the **single combined service** ($0, Free tier). One Render Web Service
runs all 9 FastAPI microservices + the gateway in one container
(`Dockerfile.allinone` → `run_all_in_one.py`). The DB stays on **Neon**.

The gateway binds Render's `$PORT` and is your public backend URL. The 9 services
run on loopback inside the container, so no `SERVICE_URL_*` vars are needed.

---

## Option A — Blueprint (one click)

`backend/render.yaml` is committed and already set to the single-service layout.

1. **Render → New → Blueprint → repo `gtproject`** (branch `main`).
2. It proposes one service: **`gtproject-backend`** (Docker, Free, Singapore).
   Click **Apply**.
3. Render prompts for the secrets — fill them (values from `backend/.env`):
   - `DATABASE_URL` — your Neon **glimmora** connection string
   - `API_SECRET_KEY` — same value as frontend `AUTH_SECRET` (from your
     `.env.local`); MUST match or cross-app logins fail
   - `SUPER_ADMIN_EMAIL` = `superadmin@glimmora.dev`
   - `SUPER_ADMIN_PASSWORD` = `glimmora123`
   - `EMAIL_USER`, `EMAIL_APP_PASSWORD`, `EMAIL_FROM` — your Gmail + app password
   (`SMTP_HOST`, `SMTP_PORT`, `SERVICE_START_STAGGER` have defaults.)
4. Deploy. First boot takes ~40s (9 services start staggered to avoid a DB
   schema-init deadlock).
5. Open the service URL → `/healthz` → `{"ok": true, "gateway": "local"}`.

**Your backend URL** = `https://gtproject-backend.onrender.com` (Render shows the
exact one). Use it for the frontend `*_API_URL` vars (see Vercel guide).

---

## Option B — Manual New Web Service

If you started from "New → Web Service" already:
- **Language**: Docker
- **Branch**: `main`
- **Root Directory**: `backend`  ← REQUIRED (Dockerfile does `COPY shared/`)
- **Dockerfile Path**: `./Dockerfile.allinone`
- **Instance Type**: Free
- **Region**: Singapore (same region as your other services)
- **Health Check Path**: `/healthz`
- **Environment Variables**: add all from `backend/.env.render.example`
  (DATABASE_URL, API_SECRET_KEY, SUPER_ADMIN_*, EMAIL_*, SMTP_*). Do **not** set
  `PORT` — Render injects it.

Then **Deploy web service**.

---

## Verify
- `https://<your-backend>.onrender.com/healthz` → 200 `{"ok":true}`
- A real route through the gateway, e.g. `POST /api/v1/auth/login`.

## Gotchas
- **Free tier sleeps** after 15 min idle → ~40s cold start on next hit. Fine for
  demo; use Starter ($7) for always-on.
- **file-service disk is ephemeral** — uploaded files vanish on redeploy. Attach a
  Render Disk to persist, or move to S3. OK for the Phase-1 demo.
- **`API_SECRET_KEY` must equal the frontend `AUTH_SECRET`** or JWTs won't verify
  across the two apps → logins fail.
