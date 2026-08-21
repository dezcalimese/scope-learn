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

The assessment owner ID is configured as `dez_calimese`. Then start the development server:

```bash
bun run dev
```

The development server proxies `/api` to the supplied assessment service because that service does not return browser CORS headers. Production hosting must use the same route. The included Vercel configuration provides this rewrite.

## Checks

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

The final README will include the complete feature list, design decisions, test guide, deployment URL, and screenshots.
