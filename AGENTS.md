<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Tracker screens live under src/routes/_authenticated; each user's tracker is one JSON row in tracker_state, loaded/saved by src/lib/store.ts — keeps the simple in-memory store while syncing across devices.
- Every route declares staticData.sitemap; the router-derived sitemap includes only discoverable public pages and excludes the authenticated subtree to protect personal trackers.
- Public visitor previews use isolated sample state, never the signed-in tracker store, so trying the product cannot change a user's real records.
