# Pen

Live HTML/CSS/JS playground. Client-side only. No auth, database, or preview compile server.

## Build commands

- Install: `npm install`
- Dev: `npm run dev`
- Production build: `npm run build`
- Start: `npm start`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Tests: `npm test` (Vitest, `lib/**/*.test.ts`)

Package manager: npm. Framework: Next.js App Router on Vercel (no extra env vars).

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui style `radix-maia` (Maia preset, Radix primitives, Hugeicons)
- CodeMirror 6 (`@uiw/react-codemirror`) for the three editors
- `react-resizable-panels` via shadcn Resizable
- lz-string + Zod for share-URL encoding

## Architecture

- `app/page.tsx` renders `PlaygroundShell` (client).
- Editors and preview never leave the browser. Preview is a sandboxed iframe `srcdoc`.
- Share state lives in the URL hash (`#d=`), optionally readable from `?d=`.
- Console captures iframe `postMessage` events with `source: "pen-console"`.

Key modules:

- `lib/playground/examples.ts` — starter pens
- `lib/playground/share.ts` — encode/decode/share URLs
- `lib/playground/preview.ts` — srcdoc + console bridge
- `components/playground/` — toolbar, desktop split panes, mobile tabs

## Conventions

- TypeScript everywhere; `interface` over `type`; no `any`
- Named exports; kebab-case files
- shadcn components from `components/ui` — do not hand-edit generated UI
- Semantic tokens only (`bg-background`, `text-muted-foreground`)
- Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`), not Lucide
- Client components that use hooks/browser APIs start with `"use client"`

## Out of scope

Auth, persistence, server-side compile, and collaboration.
