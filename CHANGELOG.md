# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Repo-level `AGENTS.md` guidance for multi-agent contribution flows.
- Tag-based GitHub release workflow with validation gates.
- `docs/ui-studio-ux-roadmap.md` — phased UX roadmap and acceptance checklist.
- `MobileViewer` — read-only Fabric canvas for phones with pinch-zoom, drag-to-pan, copy-link, and fit-to-screen, replacing the previous "Best on Desktop" splash.
- `useIsMobile` hook (viewport-based via `matchMedia`) replacing the user-agent regex.
- Canvas zoom controls (in / out / reset / fit-to-screen) with keyboard shortcuts `Cmd/Ctrl + =`, `-`, `0`, `1`.
- `fitCanvasToScreen` helper and `zoomIn` / `zoomOut` / `resetZoom` actions in `lib/canvas.ts`.
- Status bar overlay on the canvas showing object count and connection state.
- Selection highlight in the layer panel synced with canvas-side selection.
- No-selection placeholder in the right inspector with grouped sections; Text section only renders for text objects.
- Object inspector power-ups: opacity slider, stroke width, corner radius (rectangles), and X/Y/angle inputs.
- Color palette presets (12 swatches incl. transparent) and screen eyedropper (HTML5 EyeDropper API).
- Multi-select alignment buttons (left / horizontal-center / right / top / vertical-center / bottom).
- Duplicate object via inspector button or `Cmd/Ctrl + D`.
- Tool keyboard shortcuts: `V` Select, `R` Rectangle, `O` Circle, `L` Line, `T` Text, `P` Pen.
- Pan mode: hold `Space` and drag to pan the canvas.
- Brush size slider in the inspector (1–60px) when the freeform pen tool is active.
- JSON board import/export (replaces current board with an `{ version, exportedAt, objects }` payload).

### Changed
- `.gitignore` updated for 2026 local AI tooling and collaboration-friendly repo hygiene.
- MIT license copyright range refreshed to include 2026.
- Canvas zoom range lifted from 20–100% to 20–400%.
- Editor body extracted into `components/Editor.tsx`; `app/App.tsx` is now a thin mobile/desktop branch.
- Navbar layout polished with board name, status text, region dividers, and aria-labels on icon buttons.
- `selection:cleared` and `selection:updated` Fabric events now wired so the inspector reliably reflects the active object.
- `modifyShape` handles numeric coercion and applies opacity (0–100% UI mapped to 0–1 canvas) plus rectangle corner radius (`rx` / `ry`).
- Inspector `Dimensions` reorganized into a 2×2 grid of X / Y / W / H plus a rotation field.

### Added (UI library + polish)
- Inter (sans) and JetBrains Mono (mono) loaded via `next/font/google`, exposed as `font-sans` and `font-mono` Tailwind utilities.
- Resizable left and right sidebars via `react-resizable-panels` (v2). Layouts persist across reloads via the panel group `autoSaveId`.
- Radix primitives wrapped under `components/ui/`: `Slider`, `Separator`, `ScrollArea`, `Toolbar`, `Toggle`.
- Native `<input type="range">` replaced with `Slider` for opacity and brush size.
- Sidebar contents wrapped in `ScrollArea` so long inspector or layer lists scroll cleanly with a styled scrollbar.
- Pan tool: dedicated Hand button in the toolbar plus `H` keyboard shortcut. Mouse-down while Pan is active drags the canvas (alongside the existing Space-hold pan).
- All canvas-overlay dividers and toolbar dividers now use Radix `Separator`.

### Fixed
- Tooltips now use a fixed dark surface (`bg-primary-black`, white text, grey border) so they remain readable against any canvas color, including white or photographic backgrounds.
- Cursor chat bubble redesigned with the editor's dark theme — solid bubble, kbd hints for ↵ and Esc, no more `bg-blue-500` clash.
- Reaction selector restyled into a floating dark pill matching the zoom controls and status bar.
- Shortcut-hint button and shortcut panel restyled to match the floating control system; close button now has hover affordance.
- Mobile viewer "Fit to screen" button matches the rest of the floating controls.
- `/` and `e` shortcuts no longer hijack focus when typing in inspector form fields.

## [0.2.0] - 2026-05-05

### Added
- Real-time collaboration polish, onboarding, export improvements, and production-safety updates.
- Stronger documentation and release-ready project setup.

### Changed
- Project package metadata and repo guidance aligned with the current product direction.
