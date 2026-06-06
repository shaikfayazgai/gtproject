# GTPROJECT — Phase 1 Complete Testing Guide

A step-by-step manual. Follow top to bottom. Every test says **where to click**, **what to do**, and **what you should see**.

---

# PART A — HOW TO START THE SYSTEM

You must have **two things running**: the **backend** (9 services + gateway) and the **frontend** (the website). The easiest way runs both with one command and keeps them alive.

## A1. Start everything (recommended — one command)

1. Open **PowerShell** (Start menu → type "PowerShell" → Enter).
2. Paste this and press Enter:
   ```powershell
   powershell -ExecutionPolicy Bypass -File E:\GLIMMORA\educore\GTPROJECT\start-all.ps1
   ```
3. **Leave that PowerShell window open.** It starts the backend + frontend and **auto-restarts the frontend** if it ever crashes (a watchdog).
4. Wait ~30–60 seconds the first time. You'll see lines like `gateway :9000 up` and `frontend: http://localhost:3000`.

## A2. Confirm it's up

Open a browser and go to:
- **http://localhost:3000** → you should see the Glimmora marketing **home page** ("AI-Governed Outcome Delivery at Scale"). ✅
- If the home page loads, the system is ready.

## A3. Stop everything (when done)

```powershell
powershell -File E:\GLIMMORA\educore\GTPROJECT\stop-all.ps1
```

## A4. Start manually (only if A1 fails)

- Backend: `powershell -ExecutionPolicy Bypass -File E:\GLIMMORA\educore\GTPROJECT\backend\run_local.ps1`
- Frontend: open a new PowerShell:
  ```powershell
  cd E:\GLIMMORA\educore\GTPROJECT\frontend4\frontend
  $env:PORT=3000 ; npm run dev
  ```

## A5. Troubleshooting

| Problem | Fix |
|---|---|
| Home page won't load (ERR_CONNECTION) | Frontend not up — wait 60s, or re-run A1. |
| A portal kicks you back to login repeatedly | Stale session — go to `http://localhost:3000/api/auth/signout`, click Sign out, log in again. |
| "Application under review" screen | Correct for a women account before approval — see Part E. |
| Page won't update after an action | Refresh the page (some demo data is local). |

---

# PART B — IMPORTANT RULES BEFORE TESTING

Read these — they explain things that look like bugs but aren't.

1. **One role at a time per browser.** The site remembers ONE logged-in user per browser. If you log in as Enterprise, then log in as Super Admin, the Enterprise session ends.
   - **To test two roles at once:** use a **second browser** (e.g. Chrome for Enterprise, Edge for Super Admin), or an **Incognito/Private window**.

2. **How to switch roles:** go to `http://localhost:3000/api/auth/signout` → click **Sign out** → then open the new role's login page.

3. **Where data is stored (why some things reflect and some don't):**
   - **Backend (shared, shows in every browser):** logins, women-KYC approval, provisioned accounts, emails, password resets.
   - **Browser-local + step-gated:** SOW, projects, tasks, settings. These show up for the *next* role **only after the workflow advances them**. Example: a new SOW appears in the Super Admin's Commercial gate **only after** Enterprise approves the Finance stage. Same browser keeps this data.

4. **Payments are simulated** (no real money) — by design.

5. **OAuth (Google/Microsoft)** login buttons appear **only on the Contributor login** — that's intentional.

---

# PART C — LOGIN ACCOUNTS

All passwords are `Fayaz@123` **except** Super Admin.

| Role | Open this URL | Email | Password |
|---|---|---|---|
| **Super Admin** (Glimmora) | http://localhost:3000/admin/login | `superadmin@glimmora.dev` | `glimmora123` |
| **Enterprise** | http://localhost:3000/enterprise/login | `sfayazmr@gmail.com` | `Fayaz@123` |
| **Contributor** | http://localhost:3000/contributor/login | `sfayazmr1@gmail.com` | `Fayaz@123` |
| **Mentor** | http://localhost:3000/mentor/login | `sfayazmr7@gmail.com` | `Fayaz@123` |
| **Reviewer** | http://localhost:3000/reviewer/login | `sfayazmr-reviewer@gmail.com` | `Fayaz@123` |

**How to log in:** open the URL → type email + password → click **Continue** → you land on that role's dashboard.

### Test C1 — Login works for each role
For each row above: open the URL, log in, confirm you reach the dashboard, then sign out (`/api/auth/signout`) before testing the next.
**Expect:** each lands on its own dashboard; no role can open another role's pages (e.g. Contributor opening `/admin/...` is bounced).

### Test C2 — Forgot password (OTP)
1. On any login page click **Forgot password?** → `/auth/forgot-password`
2. Enter an email → **Send code** → the page shows a **dev OTP code** (since email is optional in dev)
3. Enter the code + a new password → submit.
**Expect:** "Password reset" success; you can log in with the new password.

---

# PART D — THE MAIN FLOW (SOW → DELIVERY → PAYMENT)

**This is the most important test.** It runs across 4 roles. Do the steps in order. "Switch to X" = sign out, log in as X.

### D1 — Enterprise: create a SOW
1. Log in **Enterprise**.
2. Left sidebar → **SOW Workspace** → click **New SOW** (top right). URL: `/enterprise/sow/intake`.
3. **Upload a document:** drag a PDF/DOC onto the box, or click **choose one** and pick a file (any PDF works).
4. Pick a **Confidentiality** option: Internal / Confidential / **Restricted**.
5. (Optional) type a project tag.
6. Click **Upload + extract**.
   **Expect:** it processes briefly and jumps straight to the **Submit** step showing **"Your SOW will go through these 5 stages"** = Finance, Commercial, Legal, Security, Final sign-off.
7. Click **Submit for approval**.
   **Expect:** "Submitted for approval" with a SOW id like `sow-acme-xxxx`.
8. Go to **SOW Workspace** (`/enterprise/sow`) → the SOW is listed at stage **Finance**.

### D2 — Enterprise: approve the Finance stage
1. Open the SOW (click it) → click **Sign off Finance** (or **Approve**).
2. On the approve page: choose **Approve** → **Approve stage**.
   **Expect:** Finance shows **Approved**; the next stage is **Commercial** (handled by Glimmora). The SOW now appears in the Super Admin's queue.

### D3 — Super Admin: Commercial approval + assign Mentor
1. **Switch to Super Admin.**
2. Sidebar → **Commercial gate** (`/admin/sow`). The SOW should be in the queue (status "Finance ✓ · Stage 2/5").
3. Open it → click **Approve Commercial**. A dialog opens:
   - Tick the **3 checklist** boxes.
   - **Assign mentor** — pick a mentor from the dropdown (required).
   - Type a comment (min ~10 chars).
   - Click **Approve Commercial**.
   **Expect:** success; the SOW's Commercial stage = approved, and it records "Mentor assigned by Glimmora: …".

### D4 — Enterprise: approve Legal → Security → Final
1. **Switch to Enterprise.** Open the SOW → its approve page now shows **Legal** as your turn.
2. Approve **Legal**, then reopen and approve **Security**, then **Final sign-off**.
   **Expect:** after Final, the SOW status becomes **Active** (approved for delivery). The Approval progress shows all 5 stages done.

### D5 — Enterprise: decompose the SOW into a project
1. Sidebar → **Decomposition** (`/enterprise/decomposition`).
2. Under **Awaiting decomposition**, find the SOW → click **Decompose**.
   **Expect:** a plan is created (e.g. "3 milestones · 5 tasks").
3. Open that plan → **Submit for approval** → **Approve plan**.
   **Expect:** a **delivery project** is provisioned (`/enterprise/projects/prj-...`), tasks are **published / Unassigned**.

### D6 — Enterprise: check the task pricing
1. Open the project → **Delivery** tab → click a task → opens `/enterprise/projects/[id]/tasks/[taskId]`.
2. In the **Pricing** section:
   - Click **Use AI price** → see an AI deal price.
   - OR type a number in **Manual base** → **Set manual price**.
   **Expect:**
   - **Enterprise invoice** = deal price + 18% GST.
   - **Glimmora internal** block = actual cost + **profit %**.
   - **Contributor payout** block = cheaper amount, **minus 18% GST** (net).

### D7 — Contributor: express interest
1. **Switch to Contributor.**
2. Sidebar → **Opportunities** (`/contributor/opportunities`).
   **Expect:** published tasks shown with **price first**, technologies, deadline, hours.
3. Click **I'm interested** on a task.
   **Expect:** button changes to **"Interest expressed"**.

### D8 — Enterprise: select the contributor + assign reviewer
1. **Switch to Enterprise.** Open the same task detail page.
   **Expect:** an **Interested contributors** list showing the contributor who clicked interest.
2. Click **Select** next to the contributor.
   **Expect:** task becomes **Assigned to [name]**; an **Assign reviewer** dropdown appears.
3. Pick a reviewer → **Assign reviewer**.
   **Expect:** "Reviewer: … (assigned by Enterprise)".

### D9 — Contributor: submit work (saves a version)
1. **Switch to Contributor.** Sidebar → **Delivery** (`/contributor/delivery`).
   **Expect:** the assigned task shows "Assigned — submit your work".
2. Type a work summary + an artifact link → **Submit work**.
   **Expect:** status "Submitted — awaiting mentor"; **Version history (1)** shows v1.

### D10 — Mentor gate (with revision loop)
1. **Switch to Mentor.** Sidebar → **Deliverables** (`/mentor/delivery-reviews`).
2. Open the submission. Test the revision loop first:
   - Type a comment → **Request changes**.
   **Expect:** it leaves the queue; Contributor will see the change request.
3. **Switch to Contributor** → **Delivery** → the task shows "Mentor requested changes" + the comment → type a new note → **Resubmit work** (saves **v2**).
4. **Switch to Mentor** → **Deliverables** → open → **Approve**.
   **Expect:** both v1 and v2 kept in history; status → "Mentor approved".

### D11 — Reviewer gate (final acceptance)
1. **Switch to Reviewer.** Sidebar → **Acceptance** (`/enterprise/reviewer/delivery`).
2. Open the mentor-approved task → **Accept** (or "Send back" to test rejection).
   **Expect:** status → "Accepted"; the milestone becomes payable.

### D12 — Enterprise: pay the milestone
1. **Switch to Enterprise.** Open the project → **Delivery** tab.
2. On the milestone: click **Accept milestone** → then **Pay milestone**.
   **Expect:** milestone shows **Paid**; contributor payouts emitted.

✅ **If D1–D12 all pass, the entire Phase-1 core works.**

---

# PART E — WOMEN KYC FLOW (real backend, shows across browsers)

### E1 — Women self-signup
1. Open `http://localhost:3000/auth/register?track=women` (or the register page and choose the Women track).
2. Fill the details. There is an **email OTP** step → the page shows a **dev code** → enter it.
3. Submit.
   **Expect:** "application under review" — the account is created as **pending**.

### E2 — Login while pending = blocked (hard wall)
1. Go to `/contributor/login`, log in with the women account.
   **Expect:** a full-screen **"Application under review"** wall ("A Glimmora reviewer is verifying your details…") with only a **Sign out** button — no dashboard, no onboarding. (A rejected account shows "Application not approved".)
   *(Note: this is gated on the backend `approval_status` carried in the session — verified working.)*

### E3 — Super Admin approves the KYC
1. **Switch to Super Admin** → sidebar **KYC Reviews** (`/admin/kyc`).
   **Expect:** the woman appears in the **pending** queue (this is REAL backend data).
2. Click her case → **Decision** tab → choose **Approve** → record decision.
   **Expect:** approved.

### E4 — Login after approval = unlocked
1. Log in again as the women account.
   **Expect:** no more "under review"; she proceeds (to profile/onboarding then dashboard).

---

# PART F — TENANT PROVISIONING (credential email + forced reset)

### F1 — Super Admin creates a tenant
1. **Super Admin** → **Tenants** (`/admin/tenants`) → **New tenant**.
2. Step 1: tenant name, slug, domain → Continue.
3. Step 2: **primary admin name + email** (use a real inbox you can check) → Continue.
4. Step through the remaining steps → **Provision tenant**.
   **Expect:** the provisioning page shows **"Credentials emailed"** (NOT an invite link, NO "HRIS connection" step).

### F2 — Check the email
**Expect:** an email arrives with **Email**, a **random temporary password**, and a **Log in** link to `/enterprise/login`, saying you'll set a new password on first sign-in.

### F3 — First login forces a password reset
1. Go to `/enterprise/login`, log in with that email + the temp password from the email.
   **Expect:** you're routed to **Set your password** (`/auth/change-password`).
2. Enter the temp password as **Current**, set a **New password** + confirm → **Save password**.
   **Expect:** success; you can now log in with the new password and won't be asked to reset again.

---

# PART G — OTHER FEATURES TO TEST (per portal)

## G1 — Dashboards (one per role)
Open each after logging in:
- `/admin/dashboard`, `/enterprise/dashboard`, `/contributor/dashboard`, `/mentor/dashboard`, `/enterprise/reviewer`
**Expect:** each renders with no error, shows KPI cards / counts / recent activity.

## G2 — Notifications (bell icon, top-right)
1. Click the **bell** in the top bar.
   **Expect:** a list of notifications with unread badge.
2. Click **Mark all read** → badge clears.
3. Open the full page (`/contributor/notifications` etc.) → mark individual items read, click an action link.

## G3 — Search bar (top bar, Contributor)
1. As **Contributor**, click **"Search or ask AI"** (or press Ctrl+K).
2. Type a few letters.
   **Expect:** a results dropdown; clicking a result navigates to it. (Search is enabled for the contributor portal.)

## G4 — Settings that PERSIST (Contributor) — important test
1. **Language:** `/contributor/settings/language` → change Currency (e.g. to USD) and Date format → **Save preferences** → **reload the page**.
   **Expect:** your choices are still selected after reload. ✅
2. **Notifications:** `/contributor/settings/notifications` → toggle some channel checkboxes → **Save** → reload.
   **Expect:** toggles stay. ✅
3. **MFA:** `/contributor/settings/account` → click **Turn off / Set up MFA** → reload.
   **Expect:** the on/off state persists. ✅

## G5 — Enterprise sub-areas (just open + confirm they render)
- Billing: `/enterprise/billing` (→ invoices, payouts, rate-cards)
- Workforce: `/enterprise/workforce`
- Analytics: `/enterprise/analytics` (→ economic, workforce)
- Audit: `/enterprise/audit`  · Compliance: `/enterprise/compliance`
- Settings: `/enterprise/settings` (→ tenant, security, policies, plan, integrations)

## G6 — Admin sub-areas (open + confirm render)
- Mentors: `/admin/mentors` (→ pools, new) · Skill taxonomy: `/admin/skill-taxonomy`
- Rubrics: `/admin/rubric-templates` · Email templates: `/admin/email-templates`
- Governance: `/admin/governance` · Audit: `/admin/audit`
- Payment rails: `/admin/payment-rails` · System health: `/admin/system-health`
- Partnerships: `/admin/partnerships/universities`, `/admin/partnerships/women-workforce`

## G7 — Mentor / Reviewer sub-areas
- Mentor: `/mentor/queue`, `/mentor/escalation`, `/mentor/history`, `/mentor/mentorship`, `/mentor/settings`
- Reviewer: `/enterprise/reviewer/queue`, `/enterprise/reviewer/history`, `/enterprise/reviewer/metrics`

---

# PART H — FULL ROUTE LIST (reference)

> `[id]` means a dynamic id (click an item in the list page to reach it).

### Auth / public
```
/                                  Home
/admin/login  /enterprise/login  /contributor/login  /mentor/login  /reviewer/login
/auth/register   /auth/register/enterprise  /auth/register/mentor  /auth/register/reviewer
/auth/forgot-password   /auth/change-password   /auth/reset-password
/auth/activate  /auth/mfa-setup  /auth/select-tenant  /auth/redirect
/onboarding/consent  /onboarding/availability  /onboarding/evidence
/onboarding/kyc-pending  /onboarding/complete
```

### Super Admin
```
/admin/dashboard
/admin/tenants   /admin/tenants/new   /admin/tenants/[id]   /admin/tenants/[id]/provisioning
/admin/sow   /admin/sow/[sowId]          (Commercial gate + assign mentor)
/admin/kyc   /admin/kyc/[caseId]         (KYC approve/reject)
/admin/mentors   /admin/mentors/new   /admin/mentors/[id]   /admin/mentors/pools
/admin/skill-taxonomy (+/new, /merge)    /admin/rubric-templates (+/new)
/admin/email-templates   /admin/governance (+/[caseId])   /admin/audit
/admin/ai (+/prompts)    /admin/payment-rails   /admin/system-health
/admin/partnerships/universities   /admin/partnerships/women-workforce
/admin/roles  /admin/settings  /admin/profile  /admin/notifications
```

### Enterprise
```
/enterprise/dashboard
/enterprise/sow   /enterprise/sow/intake   /enterprise/sow/[sowId]   /enterprise/sow/[sowId]/approve  /edit  /versions
/enterprise/decomposition   /enterprise/decomposition/[planId]   /[planId]/approve   /edit
/enterprise/projects   /enterprise/projects/[projectId]   /[projectId]/tasks/[taskId]   /completed
/enterprise/review (+/[submissionId], /history)
/enterprise/reviewer   (reviewer sub-portal)
/enterprise/workforce
/enterprise/billing (+/invoices/[id], /payouts/[id], /rate-cards(+new))
/enterprise/analytics (+/economic, /workforce)
/enterprise/audit   /enterprise/compliance (+/consent, /retention)
/enterprise/settings (+/tenant, /security, /policies, /plan, /integrations(+/sso,/erp,/webhooks))
/enterprise/notifications  /enterprise/profile  /enterprise/onboarding
```

### Contributor
```
/contributor/dashboard
/contributor/opportunities          (price-first + "I'm interested")     NEW
/contributor/delivery               (submit work + version history)      NEW
/contributor/tasks   /contributor/tasks/[taskId]  /[taskId]/submit  /[taskId]/revision
/contributor/tasks/submissions   /revisions   /completed
/contributor/earnings (+/history, /withdraw, /payout-method(+new), /export)
/contributor/credentials (+/[id])
/contributor/profile (+/edit, /skills, /evidence, /digital-twin)
/contributor/settings (+/account, /notifications, /language, /privacy, /sessions, /connected, /mentorship, /delete)
/contributor/support (+/tickets/new, /grievance, /safety-report)
/contributor/notifications
```

### Mentor
```
/mentor/dashboard
/mentor/queue   /mentor/queue/[reviewId] (+/diff, /audit)
/mentor/delivery-reviews             (deliverable gate)                  NEW
/mentor/escalation (+/[id])   /mentor/history (+/[id], /metrics)   /mentor/mentorship (+/[id])
/mentor/settings (+/account, /availability, /notifications, /privacy)
/mentor/profile (+/edit)   /mentor/notifications
```

### Reviewer
```
/enterprise/reviewer                 (dashboard)
/enterprise/reviewer/queue (+/[reviewId])
/enterprise/reviewer/delivery        (acceptance gate)                   NEW
/enterprise/reviewer/history   /metrics   /notifications   /profile
```

---

# PART I — WHAT'S INTENTIONALLY A PLACEHOLDER (don't report as a bug)

- **AI document extraction** on SOW upload uses default values (no real AI yet) — the full workflow is built and ready for the AI/ML phase.
- **AI price** = actual cost × a fixed factor (placeholder for real AI pricing).
- **Payments** are simulated (no real gateway).
- Some deep admin integrations (SSO test-login, ERP, webhooks) are display stubs.
- "Coming soon": Hindi/Tamil language, onboarding intro video.

---

# PART J — TEST CHECKLIST (tick as you go)

- [ ] System starts (Part A), home page loads
- [ ] All 5 logins work (C1)
- [ ] Forgot-password OTP works (C2)
- [ ] SOW create → submit (D1)
- [ ] Finance approve (D2)
- [ ] Super Admin Commercial approve + mentor assign (D3)
- [ ] Legal/Security/Final → Active (D4)
- [ ] Decompose → project provisioned (D5)
- [ ] Pricing AI + Manual shows correctly (D6)
- [ ] Contributor "I'm interested" (D7)
- [ ] Enterprise select + assign reviewer (D8)
- [ ] Contributor submit work v1 (D9)
- [ ] Mentor request changes → resubmit v2 → approve (D10)
- [ ] Reviewer accept (D11)
- [ ] Accept + Pay milestone (D12)
- [ ] Women signup → pending → admin approve → unlocked (E1–E4)
- [ ] Tenant provision → email → forced reset (F1–F3)
- [ ] All dashboards render (G1)
- [ ] Notifications bell works (G2)
- [ ] Search works (G3)
- [ ] Settings persist after reload (G4)
- [ ] Enterprise/Admin/Mentor/Reviewer sub-pages render (G5–G7)
