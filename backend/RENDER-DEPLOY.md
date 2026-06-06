# Deploying GTPROJECT Backend to Render

The backend is **9 FastAPI microservices + 1 gateway**. On Render the cleanest
layout is: the 9 services as **Private Services** (internal-only, cheaper, not
exposed to the internet) and the **gateway as one public Web Service** — that
gateway URL is your backend. The DB stays on **Neon** (no Render DB needed).

There are two ways to do it. **Option A (Blueprint) is one click.**

---

## Option A — One-click Blueprint (recommended)

A `render.yaml` is already committed at `backend/render.yaml`. It declares all 10
services + a shared env-var group.

1. **Render Dashboard → New → Blueprint**.
2. Connect the `shaikfayazgai/gtproject` repo. Render finds `backend/render.yaml`.
3. It proposes all 10 services + the `gt-backend-shared` env group. Click **Apply**.
4. Render prompts for the secret values (the `sync:false` ones):
   - `DATABASE_URL` = your Neon `glimmora` connection string
   - `JWT_SECRET`
   - `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`
   - `SMTP_USER` (`sfayazmr@gmail.com`), `SMTP_PASSWORD` (Gmail app password)
   (`SMTP_HOST`/`SMTP_PORT` already have defaults.)
5. Deploy. The 9 private services come up, then the gateway.
6. Open the **gateway** service → its public URL → visit `/healthz` →
   `{"ok": true, "gateway": "local"}`.

That's it.

---

## Option B — Manual (dashboard, 10 services)

If you'd rather not use the blueprint:

### The 9 microservices — as **Private Service** each
For every service: **New → Private Service → repo `gtproject` → Docker**.
- **Root Directory** = `backend`  (so each Dockerfile's `COPY shared/` works)
- **Dockerfile Path** = per the table below
- **Name** = per the table (this name becomes the internal hostname)
- **Env var** `PORT=8000` + the shared vars (see below)

| Service name | Dockerfile Path |
|---|---|
| `auth` | `services/auth-service/Dockerfile` |
| `contributor` | `services/contributor-service/Dockerfile` |
| `enterprise` | `services/enterprise-service/Dockerfile` |
| `superadmin` | `services/superadmin-service/Dockerfile` |
| `mentor` | `services/mentor-service/Dockerfile` |
| `universities` | `services/universities-service/Dockerfile` |
| `women` | `services/women-service/Dockerfile` |
| `email` | `services/email-service/Dockerfile` |
| `file` | `services/file-service/Dockerfile` |

### The gateway — as a public **Web Service**
- **New → Web Service → repo → Docker**
- **Root Directory** = `backend`, **Dockerfile Path** = `Dockerfile.gateway`
- **Health Check Path** = `/healthz`
- **Env vars** (point gateway at the 9 private services by their name):
  ```
  SERVICE_URL_AUTH=http://auth:8000
  SERVICE_URL_CONTRIBUTOR=http://contributor:8000
  SERVICE_URL_ENTERPRISE=http://enterprise:8000
  SERVICE_URL_SUPERADMIN=http://superadmin:8000
  SERVICE_URL_MENTOR=http://mentor:8000
  SERVICE_URL_UNIVERSITIES=http://universities:8000
  SERVICE_URL_WOMEN=http://women:8000
  SERVICE_URL_EMAIL=http://email:8000
  SERVICE_URL_FILE=http://file:8000
  ```
  > On Render, a private service is reachable inside your account at
  > `http://<service-name>:<port>`. We pin `PORT=8000`, so these stay stable.

### Shared env vars (all 9 services)
Create an **Environment Group** `gt-backend-shared` and attach it to each service:
```
DATABASE_URL=<Neon glimmora connection string>
JWT_SECRET=<...>
SUPER_ADMIN_EMAIL=<...>
SUPER_ADMIN_PASSWORD=<...>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sfayazmr@gmail.com
SMTP_PASSWORD=<gmail app password>
```
(Copy the full set from your local `backend/.env` — it's git-ignored, so values
aren't in the repo.)

---

## After deploy
1. `https://<gateway>.onrender.com/healthz` → `{"ok": true}`.
2. Smoke-test a real route through the gateway, e.g. the auth login endpoint.
3. Point the frontend's backend-URL env var at `https://<gateway>.onrender.com`.

---

## Render gotchas
- **Free tier sleeps** after 15 min idle — first request cold-starts (~30s).
  For a demo that's OK; for always-on use a paid instance.
- **Build context = `backend/`** (Root Directory). Required for `COPY shared/`.
- **file-service disk is ephemeral** on Render too — uploads vanish on redeploy.
  Attach a Render Disk to the file service, or move to S3/Neon. Fine for demo.
- **Neon** also sleeps on free tier — combined with Render sleep, the very first
  hit after long idle is slow, then fine.
