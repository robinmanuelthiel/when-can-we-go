# When Can We Go?

A tiny, no-login group event planner — for trips, dinners, game nights or
anything else you need to find a date for. Share one link; everyone marks the
days they **can't** make it (or "maybe not"), from any phone or laptop. A live
heatmap overlays everyone's blockers and surfaces the best windows where the
whole group is free.

- No accounts, no app — just open the link.
- One calendar: view the group heatmap, or hit **Edit my availability** and tap
  a day to cycle *Free → Can't make it → Maybe not*.
- You only edit your own availability. Who you are is remembered per device and
  can be changed deliberately via ⚙ Settings → "Viewing as".
- Data syncs live across devices via Firebase Realtime Database.
- The room id lives in the URL (`/event?e=<id>`), so the share link *is* the
  room. Old `/trip?t=<id>` links keep working and redirect.

Static pages (`index.html`, `event.html`, `shared.js`), served via GitHub Pages.

## PR previews

Every pull request is deployed to its own temporary Firebase Hosting preview
channel `pr-<number>` (`.github/workflows/preview.yml`); a bot comments the
preview URL on the PR and updates it on each push. Production is still served
from GitHub Pages.

**Previews are deleted automatically by Google (Firebase Hosting) 7 days after
the last push to the PR.** There is no cleanup step, so closing or merging a PR
doesn't remove its preview early. Push again (or re-run the workflow) to bring
an expired preview back.

One-time setup:

1. Firebase console → project `when-can-we-go` → **Hosting** → *Get started*
   (enables Hosting; no need to deploy anything to the live site).
2. Google Cloud console → IAM & Admin → **Service accounts** (project
   `when-can-we-go`) → create one with the roles **Firebase Hosting Admin**
   and **API Keys Viewer** → *Keys* → add a JSON key. Paste the whole JSON as
   the GitHub repo secret `FIREBASE_SERVICE_ACCOUNT_WHEN_CAN_WE_GO`
   (Settings → Secrets and variables → Actions).
3. If the Firebase API key has HTTP referrer restrictions, allow
   `when-can-we-go--*.web.app`.

Note: previews talk to the **same** Realtime Database as production, so events
created in a preview are real data.
