# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cent is a free, open-source collaborative accounting PWA. It's a **pure frontend app** — no backend server. Data is stored as JSON in the user's Gitee repo, with incremental sync for multi-user collaboration.

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
- Tab indent for non-JS/TS files, 4-space indent with double quotes and semicolons for JS/TS
- Conventional Commits enforced by commitlint (`feat:`, `fix:`, etc.)

## Architecture

### Tech Stack

Vue 3 + TypeScript + Vite 8 + Vant 4 (mobile UI library) + vue-router + vite-plugin-pwa

### Routing (`src/router/index.ts`)

Vue Router with **memory history** (no URL bar changes). Routes:

- `/login` — Login page
- `/book-select` — Book selection after login
- `/` — `MainLayout` (tab bar) with children: `/` (Stat), `/home` (Home), `/assets` (Assets), `/profile` (Profile)

Navigation guards enforce auth flow: redirect to `/login` if no token, to `/book-select` if no selected book.

### Sync Layer (`src/tidal/`, `src/database/`)

- **Tidal** (`src/tidal/index.ts`): The sync engine. Creates a storage abstraction over remote backends. Handles fetching remote structure, diffing, chunk-based storage, and upload. The `Syncer` interface defines the contract each backend must implement.
- **Stash** (`src/database/stash.ts`): Local queue for pending changes (actions) before sync. `StashBucket` manages items, meta, and config in IndexedDB.
- **Storage** (`src/database/storage.ts`): `BillIndexedDBStorage` — IndexedDB-backed `StashStorage` implementation using the `idb` library.
- **Scheduler** (`src/database/scheduler.ts`): Debounced sync scheduler that coalesces rapid writes into a single upload.

### API Endpoint (`src/api/endpoints/`)

Only **Gitee** is currently implemented. `GiteeEndpoint` (`gitee/index.ts`) is a `SyncEndpointFactory` that wires up Tidal + IndexedDB + the Gitee syncer. The `SyncEndpoint` interface (`type.ts`) defines the full contract: CRUD, sync, user info, collaborators.

Auth: Gitee OAuth or manual token entry. Token stored in `localStorage` key `gitee_user_token`.

### Data Model (`src/ledger/type.ts`)

- **Bill**: Core entity — id, type (income/expense/transfer), categoryId, amount (integer, 10000:1 ratio), time, currency info, tags, location, images, accountId, transferTo
- **BillCategory**: Hierarchical (parent/child), with icon and color
- **GlobalMeta**: Categories, tags, accounts, budgets, filters, currency config, map keys, widgets
- **ExportedJSON**: `{ items: Bill[], meta: GlobalMeta, profile? }` — the complete book format

### Composables (`src/composables/`)

- `useAuth()`: Login state, token management, Gitee user info fetch
- `useSync()`: Endpoint initialization, book selection, exposes the `SyncEndpoint` instance

These use Vue `ref()` at module level (singleton state, not per-component).

### Pages (`src/pages/`)

- `Login.vue` — Gitee token entry
- `BookSelect.vue` — Choose or create a book
- `Home.vue` — Bill list and editing
- `Stat.vue` — Statistics and charts
- `Assets.vue` — Account/asset management
- `Profile.vue` — User settings

### UI Components (`src/components/`)

Vant components auto-imported via `unplugin-vue-components` + `VantResolver`. Custom components in `src/components/`.

### i18n (`src/i18n/index.ts`)

Stub `t()` function — currently returns the key as-is. Prepared for future internationalization.

### Path Alias

`@` maps to `./src` (configured in vite.config.ts).

## Environment Variables

```
VITE_GTAG_SCRIPT=           # Google Analytics tag
VITE_LOGIN_API_HOST=         # OAuth login endpoint
VITE_RATE_API_HOST=          # Currency rate API endpoint
```
