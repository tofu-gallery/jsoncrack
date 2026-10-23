# Tofu gallery copy

This repository is Tofu's copy of **AykutSarac/jsoncrack.com** (licence: Apache-2.0), listed in Tofu's app gallery as **JSON graph viewer**, based on **JSON Crack**.

- `main` mirrors the upstream repository and is never committed to by Tofu.
- `tofu` carries Tofu's own changes; tags named `pin/<date>` mark the versions the gallery points to.
- A visitor who chooses this app gets a private snapshot of the pinned version in their own Tofu account. Their copy does not follow upstream updates.

## What the app is

JSON Crack turns JSON, YAML, XML or CSV into an interactive graph you can pan, zoom, search and collapse, next to a text editor. It can also show the data as a tree, convert it between those formats, validate it against a JSON Schema, query it with jq or JSONPath, generate types (TypeScript, Go, Kotlin, Rust or a JSON Schema) and save the graph as a PNG, JPEG or SVG image. Everything runs in the visitor's browser: there are no accounts, no server-side storage and no API routes, and the document lives in the tab's `sessionStorage`.

## How Tofu runs it

- Preset: `nextjs` (Next.js 16.3.5, pages router, webpack build). Tofu's detector reads the repository root as a pnpm workspace and cannot choose a preset by itself, so confirm `nextjs`.
- App root: the whole repository, not `apps/www`. The app imports the workspace package `packages/jsoncrack-react` and takes React from the root's pnpm catalog.
- Install: Vercel's default `pnpm install` (frozen lockfile). The root `package.json` asks for Node.js 24 or later and pnpm 10 or later and names `pnpm@10.20.0` as its package manager. Vercel takes Node.js 24 from `engines.node`, which also satisfies the root `.npmrc`'s `engine-strict=true`, and gives a new project with this lockfile (`lockfileVersion: '9.0'`) pnpm 10. pnpm 9.7 or later switches itself to the `packageManager` version, as a local run of pnpm 9.7.0 did.
- Build: `vercel.json` sets the build command `pnpm --filter jsoncrack-react build && pnpm --filter www build` and the output directory `apps/www/.next`. `apps/www`'s own `build` script runs `next build --webpack`, then `next-sitemap`.
- Database: none.
- Settings: none are needed. See "Settings the owner can set" for optional ones.

## What Tofu changes

- `apps/www/next.config.js`:
  - no `output: "export"`, so `next build` makes a standard Next.js app that `next start` and Tofu's Next.js hosting serve. Upstream exports a static site to `apps/www/out/`, which `next start` refuses to serve. Every page is still prerendered at build time, so the app behaves the same.
  - `nextjs-google-analytics` resolves to `apps/www/shims/nextjs-google-analytics.ts`, for webpack (with `transpilePackages`, so the server bundle takes the alias too) and for Turbopack.
  - the client build emits jq-web's own `jq.wasm` as `static/chunks/jq.wasm` (`emitJqWasm`); see `useJsonQuery.ts` below.
- `apps/www/shims/nextjs-google-analytics.ts` (new): a no-op stand-in for the package. Upstream renders Google Analytics from `_app.tsx` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and calls `event()` from 29 places in 13 editor files. A copy now ships no Google Analytics code, and setting that variable loads nothing. Those 14 files are untouched.
- `apps/www/src/hooks/useJsonQuery.ts`: Tools > JSON Query (jq) failed upstream too, in two ways. jq-web fetches `jq.wasm` from `/_next/static/chunks/`, where nothing put it (jsoncrack.com answered 404 there on 2026-10-23), and this hook called `jq.promised.json`, which jq-web 0.6 no longer has. With the file emitted by `next.config.js` and the hook calling `json` on what jq-web 0.6 exports, a query now works.
- `vercel.json` (new): the build described above. It skips upstream's `turbo run build`, whose strict environment mode hides undeclared variables from the build, and builds `jsoncrack-react` first because the app imports its `dist/`.
- `package.json` and `pnpm-lock.yaml`: the root declares `next` at the same version as `apps/www` (16.3.5). Vercel's Next.js builder resolves `next` from the repository root, and without it the build stops with `NEXT_NO_VERSION`. The lockfile gains three lines and resolves the same `next` package `apps/www` already uses.
- `TOFU.md`: this file.

Nothing else changed. In particular the name, logo, favicon, landing page, links and upstream's promotion of its paid product ToDiagram stay as they are. `pnpm --filter www lint` (upstream's tsc, eslint and prettier checks) passes.

## What a copy still contacts

No call needs a key or an account.

- In the visitor's browser:
  - the text editor loads Monaco from `https://unpkg.com/monaco-editor@0.55.1/min/vs`, so it needs unpkg to be reachable.
  - the graph view shows upstream's **Open in ToDiagram** button. Clicking it opens `todiagram.com` in a new tab and hands it the current document through `postMessage`. Nothing is sent without that click.
  - when a document has more nodes than the limit, the graph shows upstream's "Upgrade Required" overlay, which loads `https://todiagram.com/logo.svg` and offers the same hand-off.
  - `/editor?json=<url>` fetches a document from the address in the link.
  - `/docs` embeds three CodePen examples in iframes.
  - the toolbar, navbar and footer link to ToDiagram, the Chrome Web Store, the VS Code Marketplace, GitHub, Discord, X and LinkedIn.
- While building: `next/font/google` downloads the Inter and Oxygen fonts once and serves them from the app, and the landing page reads the repository's star count from `api.github.com` (it shows 0 if that fails).

## Settings the owner can set

| Name | Value | Kind |
|---|---|---|
| `NEXT_PUBLIC_NODE_LIMIT` | the most nodes the graph draws before it shows the "too large" overlay. Upstream's committed `apps/www/.env` sets `1200`; a value saved in Tofu replaces it, and without either the app uses `1500` | public |
| `NEXT_PUBLIC_DISABLE_EXTERNAL_MODE` | `true` hides the toolbar's "Upgrade to Pro Editor" link to ToDiagram (upstream's own switch for self-hosted copies) | public |

Both are written into the pages when the app is built, so deploy again after changing one. `NEXT_PUBLIC_GA_MEASUREMENT_ID` does nothing in this copy. The committed `apps/www/.env` and `apps/www/.env.development` hold no secret, only these public values and `NEXT_TELEMETRY_DISABLED=1`; `.env.development` is read by `next dev` alone.

## Before offering it

- `/legal/privacy` and `/legal/terms` are jsoncrack.com's own documents. They describe jsoncrack.com's service, including Google Analytics, which this copy does not load. An owner who publishes their copy should replace or remove them.
- `/`, `/editor`, `/docs` and the legal pages name their jsoncrack.com addresses as canonical, the social preview image is `https://jsoncrack.com/assets/jsoncrack.png`, and `apps/www/public/robots.txt`, the sitemap (`next-sitemap.config.js`) and `apps/www/public/CNAME` point at jsoncrack.com too. A copy works at its own address; search engines will treat it as a duplicate of jsoncrack.com.
- `apps/www/Dockerfile`, `apps/www/nginx.conf` and `apps/www/docker-compose.yml` package upstream's static export, which the `tofu` branch no longer builds. Tofu does not use them. The repository root has no container file, so Tofu does not read them as one.
- The repository also holds upstream's VS Code extension (`apps/vscode`, MIT) and Chrome extension (`apps/chrome-extension`). Their dependencies are installed with the workspace, but they are never built or deployed. One of them, `keytar`, is an optional native module: if it cannot be built on the build machine, pnpm skips it and the install goes on.
- Size: 213 files, about 1.7 MB as a compressed archive. Nothing was removed.

## Checked locally (2026-10-23)

Node.js 24.22.1 and pnpm 10.20.0 (from `packageManager`, through Corepack), in a fresh clone of the pinned commit:

- `pnpm install --frozen-lockfile`: installs the workspace. From the repository root, `require.resolve('next/package.json')` finds Next.js 16.3.5, which is what Vercel's Next.js builder looks up.
- `pnpm --filter jsoncrack-react build && pnpm --filter www build` (the `vercel.json` build command): passes in about 40 seconds. All seven pages are prerendered: `/` (getStaticProps), `/404`, `/docs`, `/editor`, `/legal/privacy`, `/legal/terms`, `/widget`.
- `next start -p 4418` in `apps/www`: `/`, `/editor`, `/widget`, `/docs`, `/legal/privacy` and `/legal/terms` answer 200, an unknown path 404. All 40 `/_next/` files the landing page and the editor reference answer 200, and the WebAssembly files (`/_next/static/wasm/…`, `/_next/static/chunks/jq.wasm`) are served as `application/wasm`.
- No JavaScript file in `apps/www/.next/static` or `apps/www/.next/server` mentions `googletagmanager`, `google-analytics` or `gtag/js`, and no page's HTML does. The browser source maps still show upstream's unchanged `import … from "nextjs-google-analytics"` lines, and show that the shim is what was bundled.
- Headless Chromium against `next start`: the landing page renders; `/editor` draws the sample document as a 10-node graph; replacing the text in the editor draws the new document; Tools > Generate Type writes TypeScript interfaces; Tools > JSON Query with `[.fruits[].name]` replaces the document with `["Apple", "Banana", "Orange"]`; `window.gtag` and `window.dataLayer` are undefined and no Google script loads; the console shows no errors and the page throws none.

Not checked: a deploy on Tofu itself.

## Upstream

- Repository: https://github.com/AykutSarac/jsoncrack.com
- Commit: `a46d0d0adb098e12e577a083e87ead7f61f90098` (2026-09-14, "fix: ensure onCollapseChange fires correctly after state updates"), the head of upstream `main` on 2026-10-23.

## Licence

Apache-2.0, Copyright 2025 Aykut Saraç (`LICENSE.md`, also in `apps/www/` and `packages/jsoncrack-react/`; `apps/vscode/LICENSE.md` is MIT). Licence files and copyright notices stay as they are. Every file Tofu changes says so at its top, except three that cannot carry a note and are listed above: `vercel.json` and `package.json`, because JSON takes no comments, and `pnpm-lock.yaml`, which pnpm generates.
