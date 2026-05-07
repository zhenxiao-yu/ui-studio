# Contributing to UI Studio

Thanks for contributing. UI Studio is a realtime collaboration app, so the bar for changes is correctness first: stable canvas behavior, reliable sync, and clear verification.

## Before You Start

- Read [README.md](README.md) and [AGENTS.md](AGENTS.md).
- For larger collaboration or routing changes, open an issue first.
- Keep PRs focused. Avoid combining canvas behavior, UI redesign, and deployment changes unless they belong together.

## Local Setup

```bash
git clone https://github.com/zhenxiao-yu/ui-studio.git
cd ui-studio
npm install
cp .env.example .env.local
npm run dev
```

## Validation

Run this before opening a PR:

```bash
npm run lint
npm run typecheck
npm run build
```

Also manually verify the affected flow in the browser. If your change touches collaboration, exports, room routing, or selection behavior, test those paths explicitly.

## Contribution Rules

- Never commit Liveblocks keys or populated env files.
- Preserve collaboration stability and keyboard-friendly interactions.
- Prefer small, reviewable diffs over broad refactors.
- Update docs and changelog entries when setup, shortcuts, or product behavior changes.

## Commit Style

Use conventional-style commit messages where possible:

```text
feat: add better room onboarding
fix(canvas): preserve selection on sync
docs: clarify Liveblocks setup
```

## Pull Requests

Please include:
- what changed
- why it changed
- how you validated it
- screenshots or recordings for UI-visible changes

## Release Notes

Add notable collaboration, export, setup, or UX changes to [CHANGELOG.md](CHANGELOG.md).
