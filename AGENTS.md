# AGENTS.md

## Project Intent
UI Studio is a real-time collaborative canvas app. Priorities are collaboration correctness, stable canvas behavior, and polished export and editing workflows.

## Preferred Agent Workflow
1. Planner: inspect the affected canvas, Liveblocks, and sidebar/export surfaces before editing.
2. Builder: keep ownership narrow and avoid mixing unrelated canvas, UI, and infra changes.
3. Reviewer: verify behavior manually and confirm the main commands still pass.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validation
```bash
npm run lint
npm run typecheck
npm run build
```
When changing collaboration, selection, export, or room routing behavior, also run a manual browser smoke test.

## Guardrails
- Never commit secrets or Liveblocks keys.
- Preserve room-link collaboration unless a task explicitly changes access behavior.
- Keep canvas interactions keyboard-safe and export behavior stable.
- Update README when onboarding, shortcuts, or deployment steps change.

## Release Hygiene
- Treat room-routing, export, and collaboration changes as release-note worthy.
- Confirm docs and demo instructions still match the current product.
- Keep generated local state, AI tool state, and design scratch output out of git.