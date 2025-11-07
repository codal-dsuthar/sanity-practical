# Sanity Training

Purpose

This workspace contains a Next.js frontend and a Sanity Studio for managing content. Use it to develop and run the frontend site and manage content in Studio.

Repository layout

- `frontend/` — Next.js application
- `studio/` — Sanity Studio and schema definitions
- `static/` — static assets

Prerequisites

- Node.js (v18+ recommended)
- pnpm (this repository uses pnpm workspaces)

Quick start

1. Install dependencies

```bash
pnpm install
```

2. Start development servers

```bash
pnpm run dev
```

The frontend typically runs at http://localhost:3000 and the Studio at http://localhost:3333.

Running parts independently

- To run only the frontend: open a terminal, `cd frontend` then `pnpm dev`.
- To run only the Studio: open a terminal, `cd studio` then `pnpm dev`.

Deployment notes

- Deploy the frontend to your hosting provider (Vercel is commonly used).
- Deploy the Studio with the Sanity CLI from the `studio` folder when needed.

Contributing / changes

- Edit schemas in `studio/src/schemaTypes`.
- Update frontend UI in `frontend/app` and `frontend/components`.

Resources

- Sanity docs: https://www.sanity.io/docs
- Next.js docs: https://nextjs.org/docs

If you want additional developer docs (CONTRIBUTING, upgrade notes, or CI instructions), tell me which page to add and I’ll create it.

