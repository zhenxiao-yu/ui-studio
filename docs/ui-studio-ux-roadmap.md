# UI Studio — UX Roadmap

A working document tracking what UI Studio's editor experience needs in order to feel like a real collaborative design tool, not a prototype. Phased so each phase ships independently.

## Audit (May 2026)

What works:

- Three-region editor shell (toolbar / layers / canvas / inspector) is structurally correct.
- Hooks already extracted from `App.tsx` — `useFabricCanvas`, `useLiveStorage`, `useInterval`, `useMaxZIndex`. App composition is ~50 lines.
- Liveblocks sync is solid: object-level diffing in `renderCanvas`, throttled mid-draw sync, keyboard shortcuts for clipboard + history.
- Layer panel has a real empty state and click-to-select wired through `fabricRef`.
- Connection status dot in navbar with toast on disconnect.

What's rough:

- **Mobile is a wall.** UA regex check at `components/Navbar.tsx:31-43` returns a "Best on Desktop" splash. Phones cannot view, comment on, or even share the board URL meaningfully.
- **Right inspector renders all controls regardless of selection** (`components/RightSidebar.tsx:48`). Confusing when nothing is selected; controls appear permanently active.
- **No visual selection feedback in the layer panel.** Clicking a layer selects it on canvas, but the layer row doesn't reflect canvas-side selection.
- **Canvas zoom is wheel-only and capped at 1.0** (`lib/canvas.ts:460-482`). No zoom in/out buttons, no fit-to-screen, no keyboard zoom shortcuts, no pan mode. The zoom indicator at `Live.tsx:316` is read-only.
- **No status bar.** Object count and connection status aren't surfaced near the canvas.
- **Toolbar grouping is implicit.** The three navbar regions exist but lack visual separation; the board has no name displayed.

## Phase 1 — First UX polish PR (in progress)

Scope: roadmap doc, mobile viewer, toolbar refinement, inspector no-selection state, layer selection highlight, canvas zoom/fit/status controls.

Work items:

| # | Item | Files |
|---|---|---|
| 1 | This document | `docs/ui-studio-ux-roadmap.md` |
| 2 | Viewport-based mobile detection | `hooks/useIsMobile.ts` (new) |
| 3 | Read-only mobile viewer | `components/MobileViewer.tsx` (new), `app/App.tsx` |
| 4 | Toolbar: board name, region dividers, refined active state | `components/Navbar.tsx` |
| 5 | Inspector: no-selection state + grouped sections | `components/RightSidebar.tsx` |
| 6 | Layer panel selection highlight | `components/LeftSidebar.tsx`, `app/App.tsx` |
| 7 | Zoom controls overlay (in/out/reset/fit) | `components/Live.tsx`, `lib/canvas.ts` |
| 8 | Lift `maxZoom` from 1.0 → 4.0 | `lib/canvas.ts` |
| 9 | `fitCanvasToScreen` helper | `lib/canvas.ts` |
| 10 | Keyboard zoom shortcuts (`Cmd+=`, `Cmd+-`, `Cmd+0`, `Cmd+1`) | `lib/key-events.ts` |
| 11 | Status bar (object count + connection status) | `components/Live.tsx` |

Acceptance:

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass.
- [ ] On a phone-sized viewport, the board route renders `MobileViewer` with read-only Fabric canvas, board name, copy-share-URL, and live updates from desktop sessions.
- [ ] On desktop, clicking a layer highlights its row; clicking a shape on canvas highlights the matching row.
- [ ] Inspector shows a no-selection placeholder when no object is active; controls are grouped (Position & Size, Fill & Stroke, Text, Order, Export); Text section hides for non-text objects.
- [ ] Zoom buttons in/out/reset/fit work; `Cmd+=`/`-`/`0`/`1` work; zoom range is 20%–400%.
- [ ] No regression in existing collaboration features (cursors, comments, reactions, presence).

## Phase 2 — Accessibility sweep (deferred)

- aria-label on every icon-only button (toolbar, layer rows, inspector controls, zoom controls).
- Visible focus rings on all interactive elements (currently relying on browser defaults).
- Respect `prefers-reduced-motion` for FlyingReaction and cursor animation.
- Keyboard escape from text editing must always release focus from the canvas.
- Verify color contrast against WCAG AA on `primary-grey-300` (current low-contrast text).

## Phase 3 — Collaboration UX tuning (deferred)

- Cursor label readability (current labels can stack and overlap).
- Reaction frequency cap so a held mouse doesn't flood the canvas at 100ms.
- Comment pin density: cluster nearby pins; show a count badge.
- Typing indicator decay (currently presence "message" doesn't have a clear lifecycle).

## Phase 4 — Persistence & file format (deferred)

- JSON export of the full board (canvasObjects + threads).
- JSON import with ID rewriting to avoid collisions.
- SVG export of the canvas (Fabric supports this natively via `canvas.toSVG()`).
- Duplicate-board action.

## Phase 5 — Editor power features (deferred)

- Command palette (Cmd+K) with all toolbar actions and shortcuts.
- Multi-select alignment tools (align left/center/right, distribute).
- Pan mode (hold Space + drag) — investigated in Phase 1 but deferred if Fabric v5's pan API conflicts with browser scroll.
- Smart guides / snap-to-edges.

## Phase 6 — Test infrastructure (deferred)

- Vitest for `lib/` pure helpers (shape creation, zoom math, key events).
- Playwright smoke test: load board, create a rectangle, reload, verify persistence.
- Playwright collab test: two contexts on the same room, verify cross-window sync.

## Phase 7 — Auth & boards (deferred)

- Liveblocks auth backend (currently public key only).
- Per-user board ownership and access control.
- Board metadata (name, owner, last edited) stored outside Liveblocks rooms.

## Notes

- **Tailwind v3** — keep `bg-primary-*` palette syntax; do not migrate to v4 in scope.
- **Fabric v5** — do not migrate to v6.
- **Build must pass TypeScript** — `ignoreBuildErrors` was removed deliberately. Don't reintroduce it.
