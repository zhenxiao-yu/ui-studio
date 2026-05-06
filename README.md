# UI Studio

**A real-time collaborative design canvas for the web.**

Draw shapes, annotate with comments, chat with your team, and export your work — all synchronized live across every connected browser.

> Built as a serious portfolio project and open-source reference for real-time collaborative canvas applications.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ui--studio--mu.vercel.app-brightgreen)](https://ui-studio-mu.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

---

## Screenshots

> _Add screenshots or a GIF of the canvas in action here._

---

## Features

| Feature | Description |
|---|---|
| **Multi-user canvas** | Draw and edit shapes simultaneously with collaborators |
| **Live cursors** | See every connected user's cursor position in real time |
| **Cursor chat** | Press `/` to send ephemeral messages via your cursor |
| **Emoji reactions** | Press `E` to pick and broadcast floating emoji reactions |
| **Pinned comments** | Click the comment tool to attach threaded notes to any canvas position |
| **Shape tools** | Rectangle, circle, triangle, line, freeform drawing |
| **Image import** | Upload images directly onto the canvas |
| **Text tool** | Add and edit inline text on the canvas |
| **Property inspector** | Edit width, height, fill color, stroke, font family/size/weight |
| **Layer panel** | View all canvas objects; click to select |
| **Object ordering** | Bring to front / send to back |
| **Zoom** | Scroll to zoom; live zoom indicator |
| **Undo / Redo** | Full collaborative history via Liveblocks |
| **Keyboard shortcuts** | Copy, paste, cut, delete, undo, redo — see shortcut panel |
| **PNG export** | Export the canvas as a PNG image |
| **PDF export** | Export the canvas as a PDF document |
| **Multi-room** | Each board gets a unique URL; share to collaborate |
| **Onboarding** | First-visit guide for new users |
| **Connection status** | Live indicator showing sync state |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Canvas | [Fabric.js v5](http://fabricjs.com/) |
| Real-time | [Liveblocks](https://liveblocks.io/) (presence, storage, comments) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## Architecture

```
app/
  page.tsx              # Home — creates a new board UUID, redirects
  layout.tsx            # Root layout: fonts, ErrorBoundary, Toaster
  board/[roomId]/
    page.tsx            # Canvas board: wraps App in Room provider
  App.tsx               # Canvas orchestration (Fabric lifecycle + Liveblocks mutations)
  Room.tsx              # Liveblocks RoomProvider wrapper

components/
  Navbar.tsx            # Tool selector, active users, connection status
  LeftSidebar.tsx       # Layers panel (click-to-select)
  RightSidebar.tsx      # Property inspector, element order, export
  Live.tsx              # Canvas interaction area: cursors, reactions, comments, zoom
  Loader.tsx            # Suspense fallback
  ErrorBoundary.tsx     # Catches and displays runtime errors
  Onboarding.tsx        # First-visit modal
  comments/             # Liveblocks Comments UI components
  cursor/               # Cursor rendering and chat
  reaction/             # Flying emoji reactions
  settings/             # Color, dimensions, text, export sub-panels
  users/                # Active users avatars
  ui/                   # Radix-based primitives (button, tooltip, etc.)

lib/
  canvas.ts             # Fabric.js canvas helpers (init, events, render, zoom)
  shapes.ts             # Shape creation, modification, ordering, image upload
  key-events.ts         # Keyboard shortcut handlers
  utils.ts              # cn(), name generation, PNG/PDF export

liveblocks.config.ts    # Liveblocks client, room context, types
constants/index.ts      # Nav elements, shape configs, shortcuts, colors
types/type.ts           # Shared TypeScript types
```

### Liveblocks Storage Schema

```ts
Storage = {
  canvasObjects: LiveMap<objectId: string, fabricJSON: object>
}

Presence = {
  cursor: { x: number; y: number } | null
  cursorColor: string | null
  editingText: string | null
  message?: string
}
```

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A [Liveblocks](https://liveblocks.io/) account (free tier works)

### 1. Clone

```bash
git clone https://github.com/zhenxiao-yu/ui-studio.git
cd ui-studio
```

### 2. Install

```bash
npm install
```

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Liveblocks public key:

```env
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_your_key_here
```

Get your key at [liveblocks.io/dashboard](https://liveblocks.io/dashboard) → Project → API Keys.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Create New Board** to start a session. Share the URL with collaborators.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check (no emit) |

---

## Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/).
3. Add the environment variable `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` in Project Settings → Environment Variables.
4. Deploy.

For production, replace the `pk_dev_` key with a `pk_live_` key from the Liveblocks dashboard.

### Manual

```bash
npm run build
npm run start
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Cursor chat | `/` |
| Emoji reactions | `E` |
| Undo | `Ctrl / ⌘ + Z` |
| Redo | `Ctrl / ⌘ + Y` |
| Copy | `Ctrl / ⌘ + C` |
| Paste | `Ctrl / ⌘ + V` |
| Cut | `Ctrl / ⌘ + X` |
| Delete selected | `Delete` / `Backspace` |
| Escape / cancel | `Escape` |
| Zoom | Scroll wheel |
| Show shortcuts | `?` button (canvas bottom-right) |

---

## Known Limitations

- **Desktop-first**: The canvas editor requires a mouse and keyboard. A simplified view is shown on mobile devices.
- **Anonymous users**: No authentication system — users are identified by random animal names per session. Liveblocks comment mentions are not wired to real accounts.
- **Room persistence**: Board data persists in Liveblocks storage for as long as your Liveblocks project retains it (depends on your plan). There is no server-side project file save beyond Liveblocks.
- **Fabric.js v5**: Uses Fabric.js v5 API. Not compatible with v6 patterns without migration.
- **No auth**: The room ID in the URL is the only access control. Anyone with the link can join.
- **Zoom cap**: Maximum zoom is 100%. You cannot zoom in beyond 1:1.

---

## Roadmap

- [ ] Object-level canvas diffing (avoid full re-render on every storage update)
- [ ] Canvas hooks refactor (extract god component `App.tsx` into focused hooks)
- [ ] Tablet / collapsible sidebar layout
- [ ] JSON project export/import
- [ ] SVG export
- [ ] User authentication + room access control
- [ ] Duplicate object
- [ ] Multi-select alignment tools
- [ ] Infinite canvas / pan mode
- [ ] Test suite (Vitest + Playwright)

---

## Credits

Developed by [ZhenXiao (Mark) Yu](https://github.com/zhenxiao-yu).

Built on top of the Liveblocks, Fabric.js, and Next.js ecosystems.

---

## License

MIT © 2024 ZhenXiao Yu
