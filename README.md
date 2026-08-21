# Scope Learn

Scope Learn is a focused educational video application for the Scope Labs frontend take-home assessment.

The application is under active development. See [ROADMAP.md](./ROADMAP.md) for the product plan, architecture, and delivery phases.

## Local Setup

Requirements:

- Bun 1.1 or later

Install and configure the application:

```bash
bun install
cp .env.example .env
```

Replace `first_last` in `.env` with the candidate's first and last name in snake case. Then start the development server:

```bash
bun run dev
```

## Checks

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

The final README will include the complete feature list, design decisions, test guide, deployment URL, and screenshots.
