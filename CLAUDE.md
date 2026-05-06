# UI Studio — Claude Code Guide

## What This Project Is

A real-time collaborative design canvas (Figma-lite) built on:
- **Next.js 14** (App Router, `"use client"` everywhere canvas-related)
- **Fabric.js v5** — canvas rendering, shape management, event system
- **Liveblocks** — real-time sync, presence, comments, reactions
- **Tailwind CSS** + **Radix UI** components
- **sonner** — toast notifications

## Dev Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build (must pass tsc --noEmit)
npm run lint     # eslint check
npx tsc --noEmit # type-check only, no emit
```

## Required Environment Variables

```
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_...   # from liveblocks.io dashboard
```

Copy `.env.example` → `.env.local` and fill in the key.

## Routing Structure

```
/                         → Home (create a new board)
/board/[roomId]           → Canvas board (each board has its own Liveblocks room)
```

## Component Map

| Component | Owns |
|---|---|
| `app/App.tsx` | Canvas lifecycle, Fabric.js events, top-level state |
| `components/Live.tsx` | Pointer events, cursor sync, reactions, chat overlay, zoom display |
| `components/Navbar.tsx` | Tool selection, connection status, active users |
| `components/LeftSidebar.tsx` | Layers panel (reads from Liveblocks storage, selects objects on canvas) |
| `components/RightSidebar.tsx` | Element properties (dimensions, text, color, alignment, export) |
| `app/Room.tsx` | Liveblocks `RoomProvider` wrapper — passes roomId from URL |
| `lib/canvas.ts` | All Fabric.js canvas utility functions |
| `lib/shapes.ts` | Shape creation, modification, bring-to-front/back |
| `lib/key-events.ts` | Keyboard shortcuts (copy, paste, cut, delete, undo, redo) |
| `lib/utils.ts` | cn(), generateRandomName(seed?), exportToPng(), exportToPdf() |

## Key Architectural Notes

- Fabric.js `fabric.Canvas` is held in `fabricRef` (a React ref) to survive re-renders without reinitializing the canvas. Never put it in `useState`.
- Liveblocks `canvasObjects` is a `LiveMap<string, any>`. Shape data is serialized via Fabric's `.toJSON()` and deserialized via `fabric.util.enlivenObjects`.
- The `Presence` type in `liveblocks.config.ts` defines per-user ephemeral data (cursor position, chat message). Keep it in sync with the `Presence` type in `types/type.ts`.
- `ignoreBuildErrors` was deliberately removed — the build **must pass TypeScript**. Do not re-add it.
- Event listeners added with `window.addEventListener` inside `useEffect` must use named stable function references so `removeEventListener` actually cleans them up.

## Known Constraints

- Fabric.js v5 API (not v6) — some v6 APIs will not exist.
- Liveblocks `@liveblocks/react-comments` v1.9.x — comment resolvers (user mentions) are stubbed; wiring them requires an auth backend.
- The canvas is a single flat layer; there is no grouping or multi-artboard support.
