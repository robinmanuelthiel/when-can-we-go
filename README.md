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
