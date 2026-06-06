# Deploying GTPROJECT Frontend to Vercel

The frontend is a Next.js 16 app at `frontend4/frontend` inside the `gtproject`
repo. Deploy AFTER the Render backend is live (you need its URL).

---

## Steps

1. **Vercel → Add New → Project → import `gtproject` repo.**
2. **Root Directory = `frontend4/frontend`** ← critical (the app is nested).
   Click "Edit" next to Root Directory and pick that folder.
3. Framework auto-detects **Next.js**. `vercel.json` already sets install/build.
   `postinstall` runs `prisma generate` automatically — no extra config.
4. **Environment Variables** — add everything from `.env.vercel.example`, with
   two values replaced:
   - all `*_API_URL` / `BACKEND_SERVICE_URL` / `INTERNAL_BACKEND_URL`
     → your Render backend URL (e.g. `https://gtproject-backend.onrender.com`)
   - `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` → your Vercel domain
     (e.g. `https://gtproject.vercel.app`)
   - keep `AUTH_SECRET` = the SAME value as the backend `API_SECRET_KEY`.
5. **Deploy.**

After the first deploy Vercel assigns the real domain. If it differs from what
you guessed, update `NEXTAUTH_URL` + `NEXT_PUBLIC_BASE_URL` to the real domain
and redeploy (NextAuth callbacks break if these are wrong).

---

## Why these values
- `AUTH_SECRET` (frontend) **must equal** `API_SECRET_KEY` (backend) — the two
  apps share JWTs; mismatched secrets → every cross-app login fails.
- The backend CORS already allows `https://*.vercel.app` (regex in
  `shared/app_factory.py`), so no backend change is needed for a `.vercel.app`
  domain. If you add a CUSTOM domain, set the backend `CORS_ORIGINS` env to
  include it.
- `DATABASE_URL` here is the **frontend's own** Neon DB (`glimmora_fe4`,
  NextAuth credentials store) — different from the backend's `glimmora` DB.

---

## OAuth redirect URIs (if using Google/Microsoft login)
In Google Cloud / Azure, add the Vercel callback URLs:
- `https://<your-app>.vercel.app/api/auth/callback/google`
- `https://<your-app>.vercel.app/api/auth/callback/microsoft-entra-id`

---

## Verify after deploy
- Open `https://<your-app>.vercel.app` → home loads.
- Log in at a portal (e.g. `/contributor/login`) with a backend test account →
  confirms frontend ↔ Render backend ↔ Neon are all wired.
- (First backend hit may be slow if Render Free instance was asleep.)
