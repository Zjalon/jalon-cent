# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cent is a free, open-source collaborative accounting PWA. It's a **pure frontend app** — no backend server. Data is stored as JSON in the user's GitHub/Gitee repo (or WebDAV/S3), with incremental sync for multi-user collaboration.

## Commands

```bash
pnpm dev          # Dev server (with --host)
pnpm build        # Lint then production build
pnpm lint         # TypeScript check + Biome lint (errors only)
pnpm check        # Biome check with auto-fix (format + lint)
```

No test suite exists yet. Pre-commit hooks (Husky) run `pnpm lint` and commitlint.

## Code Style

- **Biome** for formatting and linting (not ESLint/Prettier)
- Double quotes, 4-space indent, semicolons always in JS/TS
- Tab indent for non-JS files (JSON, etc.)
- Conventional Commits enforced by commitlint (`feat:`, `fix:`, etc.)

## Architecture

### Tech Stack

React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Zustand + shadcn/ui (new-york style)

### Data Layer (`src/tidal/`, `src/database/`)

- **Tidal** (`src/tidal/index.ts`): The sync engine. Creates a storage abstraction over remote backends. Handles fetching remote structure, diffing, chunk-based storage, and upload. The `Syncer` interface defines the contract each backend must implement.
- **Stash** (`src/database/stash.ts`): Local queue for pending changes (actions) before sync. `StashBucket` manages items, meta, and config in IndexedDB.
- **Storage backends** (`src/api/endpoints/`): `github/`, `gitee/`, `web-dav/`, `s3/`, `offline/` — each implements the endpoint interface. Selected at runtime via `localStorage` key `SYNC_ENDPOINT`.
- **Worker** (`src/api/storage/worker.ts`): Deferred storage operations run in a Web Worker via Comlink. The main thread uses `StorageDeferredAPI` (worker proxy) for reads and `StorageAPI` for writes/sync.

### State Management (`src/store/`)

Zustand stores: `ledger.ts` (bills CRUD + sync), `book.ts` (book selection), `user.ts` (auth), `preference.ts`, `currency.ts`, `assistant.ts`.

The ledger store (`useLedgerStore`) is the central store — it loads bills from the worker, handles CRUD via `StorageAPI.batch()`, and manages sync state.

### Data Model (`src/ledger/type.ts`)

- **Bill**: Core entity — id, type (income/expense), categoryId, amount (integer, 10000:1 ratio), time, currency info, tags, location, images
- **BillCategory**: Hierarchical (parent/child), with icon and color
- **GlobalMeta**: Categories, tags, budgets, filters, currency config, widgets — stored as `meta.json` in the repo
- **ExportedJSON**: `{ items: Bill[], meta: GlobalMeta }` — the complete book format

### Pages & Routing (`src/route.tsx`)

Memory router with three routes: `/` (Home), `/search`, `/stat/:id?`. Stat page lazy-loads and fetches all bills first.

### UI Components (`src/components/`)

Organized by feature: `bill-editor/`, `bill-filter/`, `chart/`, `category/`, `budget/`, `settings/`, `map/`, `assistant/`, `widget/`, `login/`, etc. Base UI primitives in `components/ui/` (shadcn/ui).

### AI Assistant (`src/assistant/`)

LLM-powered features: voice accounting, bill analysis, smart predictions. Uses OpenAI-compatible API. System prompt in `system-prompt.md`.

### i18n (`src/locale/`)

`react-intl` with JSON lang files. Use `t()` function from `@/locale` for translations.

### Path Alias

`@` maps to `./src` (configured in vite.config.ts).

## Environment Variables

```
VITE_GTAG_SCRIPT=           # Google Analytics tag
VITE_LOGIN_API_HOST=         # OAuth login endpoint
VITE_RATE_API_HOST=          # Currency rate API endpoint
```
