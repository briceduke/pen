# Pen

In-browser HTML, CSS, and JavaScript playground — CodePen-style, no backend required.

Stack: **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** with the **Maia** preset, and **ax** project context.

## Features

- Three CodeMirror 6 editors (HTML / CSS / JS) with a live, sandboxed iframe preview
- Debounced auto-run (toggleable) plus a manual **Run** action
- Console panel that captures `console.log` / `info` / `warn` / `error` and runtime exceptions from the iframe
- Resizable panes on desktop; tabbed editors + preview + console on small screens
- Share via URL hash (`#d=…`) — compressed, client-side only. Query `?d=` is also read.
- Starter examples, Reset, and keyboard shortcuts

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck
npm run lint
npm test
```

No environment variables or secrets are required.

## Deploy on Vercel

1. Import `briceduke/pen` in the Vercel dashboard (framework: Next.js).
2. Use the default build command `npm run build` and output from Next.js.
3. Deploy. Preview and share URLs stay client-side — nothing to configure.

CLI:

```bash
npx vercel
```

## Share URLs

The current pen is encoded in the page hash with lz-string:

```
https://your-domain/#d=<compressed-document>
```

- **Share** copies that URL (shortcut: `⌘/Ctrl + S`).
- Reloading the page restores the document from the hash.
- `?d=` query strings are accepted for compatibility; new shares write the hash so the payload never hits the server.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘/Ctrl + Enter` | Run preview |
| `⌘/Ctrl + S` | Copy share URL |
| `⌘/Ctrl + Shift + R` | Reset to the selected example |

## Maia + shadcn/ui

This app was scaffolded with the official CLI, not a hand-rolled theme:

```bash
npx shadcn@latest init --template next --preset maia --base radix --no-monorepo --yes --name pen
```

That produced `components.json` with `"style": "radix-maia"`, Maia’s Figtree + Geist Mono fonts, Hugeicons, and CSS variables in `app/globals.css`. UI pieces (Button, Tabs, Resizable, Switch, Select, etc.) were added with `npx shadcn@latest add`. Do not invent extra Maia tokens — use the generated semantic colors (`bg-background`, `text-muted-foreground`, …).

## ax project context

[ax](https://github.com/defai-digital/ax-cli) stores AI-oriented project context so coding agents know the stack without a long prompt.

Checked in:

- `AX.md` — primary context file (build commands, architecture, conventions)
- `.ax/settings.json` — project-level ax settings

Refresh after larger refactors:

```bash
# Interactive CLI
npx @defai.digital/ax-grok
# then: /init
```

`/init --depth=full` also writes `.ax/analysis.json`. No API keys are needed for this playground itself; ax is optional tooling around the repo.

## Security notes

Preview runs in an iframe with `sandbox="allow-scripts"` and no `allow-same-origin`. That is still **untrusted code in your browser**. Do not paste secrets into a pen, and treat shared URLs as public source.
