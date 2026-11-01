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
- AI routine suggestions stream through an authenticated server route; validate the submitted tracker snapshot and keep prompts and gateway credentials server-only. Persistent provider access blocks are service-role-only and never retried automatically.
- Growth stores daily-deduplicated first-party visits and verified sign-ins server-side; signup counts come from the auth lifecycle. Expose only an authenticated aggregate RPC, never raw visitor identifiers.
- Chat uses route-derived thread IDs and owner-scoped UIMessage histories; server-stored history is authoritative and streamed replies persist on completion. Use AI Elements for the chat surface and read-only tracker tools for personalization.
