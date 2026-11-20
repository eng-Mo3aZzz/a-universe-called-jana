<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All personal content (messages, photos, songs, quiz answers, letters) lives in `src/content/universe.server.ts`; it reaches the browser only through `getUniverseContent` after a valid unlock token, so private words never ship in the public bundle.
- The password check runs server-side (`src/lib/gate.server.ts`, secrets `SITE_PASSWORD` + `SESSION_SECRET`); unlock state is an HMAC-signed token in localStorage, not a cookie, because the editor preview is a third-party iframe where cookies get blocked.
- Sealed letters are stripped of their text on the server until their `opensAt` date.
- `/universe` and children are `ssr: false`: they depend on the 3D canvas, localStorage progress and the unlock token.
- One persistent R3F canvas (`src/components/scene/GalaxyCanvas.tsx`) is lazy-mounted in `__root` and switches look via `useScene().mode` (gate/portal/hub/stage/finale); pages set the mode with `useSceneMode`, never mount a second canvas.
- Planet labels are DOM buttons positioned from `planetScreen` (written by the scene each frame), not drei `<Html>`, which unmount-raced and lost labels.
- Progression rules are pure in `src/lib/progress-rules.ts` (tested in `src/test/rules.test.ts`); persisted progress lives in the zustand store `src/lib/progress-store.ts`.
- Roses are procedural instanced petals (`Rose.tsx`) so they can animate a real bloom; a static GLB cannot.
- Gift boxes and envelopes are CSS 3D (classes in `src/styles.css`) to avoid extra WebGL contexts on phones.
- Dev only: `window.__three` exposes the R3F state for debugging camera/scene.
