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
- No-selection placeholder in the right inspector with grouped sections (Position & Size, Fill & Stroke, Text, Arrange, Export); Text section only renders for text objects.

### Changed
- `.gitignore` updated for 2026 local AI tooling and collaboration-friendly repo hygiene.
- MIT license copyright range refreshed to include 2026.
- Canvas zoom range lifted from 20–100% to 20–400%.
- Editor body extracted into `components/Editor.tsx`; `app/App.tsx` is now a thin mobile/desktop branch.
- Navbar layout polished with board name, status text, region dividers, and aria-labels on icon buttons.
- `selection:cleared` and `selection:updated` Fabric events now wired so the inspector reliably reflects the active object.

## [0.2.0] - 2026-05-05

### Added
- Real-time collaboration polish, onboarding, export improvements, and production-safety updates.
- Stronger documentation and release-ready project setup.

### Changed
- Project package metadata and repo guidance aligned with the current product direction.
