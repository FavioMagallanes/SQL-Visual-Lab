# Implementation Plan: SQL Visual Playground

**Branch**: `001-sql-playground` | **Date**: April 3, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sql-playground/spec.md`

## Summary

Build an interactive SQL playground for beginners on the existing Next.js + Tailwind + shadcn/ui stack. The core engine uses sql.js (SQLite compiled to WASM) running client-side with Zustand for state management. Visual feedback for SQL operations (DELETE fade-out, JOIN color blocks, SELECT column highlight) is powered by Framer Motion. An AI assistant ("The Human Button") provides plain-language explanations in Spanish via an API route.

## Technical Context

**Language/Version**: TypeScript 5.9+ / React 19 / Next.js 16 (App Router)
**Primary Dependencies**: sql.js (WASM SQLite), zustand (state), framer-motion (animations), shadcn/ui (components)
**Storage**: In-memory SQLite via sql.js (ephemeral, browser-only)
**Testing**: None unless explicitly requested (per constitution)
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
**Project Type**: Web application (single-page, client-heavy)
**Performance Goals**: Initial data visible < 2s, query results < 500ms after debounce, animations < 400ms
**Constraints**: Zero backend DB setup, WASM binary loaded client-side, < 50MB total browser memory
**Scale/Scope**: ~3 tables, ~100-200 rows, single user, no auth

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                           | Status  | Notes                                                             |
| --------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| I. Code Quality (Clean Code, S.O.L.I.D.)            | ✅ PASS | Single responsibility per module, no over-engineering             |
| II. Architecture (Screaming, feature-based)         | ✅ PASS | `src/features/` with sql-engine, editor, visualizer, ai-assistant |
| III. Naming (English, kebab-case files)             | ✅ PASS | All files kebab-case, all code in English                         |
| IV. Syntax (arrow fns, export const, no forwardRef) | ✅ PASS | All exports use `export const`, arrow functions only              |
| V. Single Responsibility                            | ✅ PASS | Components presentational, logic in hooks/stores                  |
| TypeScript (strong typing, no `any`)                | ✅ PASS | All interfaces explicitly defined                                 |
| Tooling (Context7 for docs, shadcn MCP for UI)      | ✅ PASS | Documented in plan                                                |
| Code Style (ESLint, Prettier, import sort)          | ✅ PASS | Existing config maintained                                        |
| Git (Conventional Commits, English)                 | ✅ PASS | All commits follow convention                                     |
| Testing (none unless requested)                     | ✅ PASS | No tests planned                                                  |

## Project Structure

### Documentation (this feature)

```text
specs/001-sql-playground/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── sql-engine-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── sql-engine/
│   │   ├── lib/
│   │   │   ├── database-manager.ts       # sql.js initialization, lifecycle, query execution
│   │   │   ├── query-parser.ts           # Detect query type (SELECT/DELETE/JOIN/etc), block DROP/ALTER
│   │   │   └── seed-data.ts              # Initial dataset: characters, teams, fan_clubs
│   │   ├── store/
│   │   │   └── sql-store.ts              # Zustand store: db state, results, errors, query type
│   │   ├── hooks/
│   │   │   ├── use-sql-database.ts       # Init/reset DB lifecycle hook
│   │   │   └── use-query-executor.ts     # Debounced query execution hook
│   │   └── types/
│   │       └── index.ts                  # QueryResult, QueryType, DatabaseState, etc.
│   │
│   ├── editor/
│   │   ├── components/
│   │   │   └── sql-editor.tsx            # SQL textarea with syntax highlighting
│   │   ├── hooks/
│   │   │   └── use-debounced-query.ts    # Debounce input → trigger execution
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── visualizer/
│   │   ├── components/
│   │   │   ├── results-table.tsx         # Dynamic results table (presentational)
│   │   │   ├── animated-row.tsx          # Framer Motion row with exit animations
│   │   │   └── column-highlight.tsx      # Column emphasis for SELECT/JOIN
│   │   ├── hooks/
│   │   │   └── use-animation-config.ts   # Map query type → animation variant
│   │   └── types/
│   │       └── index.ts
│   │
│   └── ai-assistant/
│       ├── components/
│       │   ├── human-button.tsx          # "The Human Button" trigger
│       │   └── explanation-panel.tsx     # Collapsible AI explanation display
│       ├── hooks/
│       │   └── use-query-explanation.ts  # Fetch explanation from API route
│       ├── lib/
│       │   └── explanation-service.ts    # AI prompt construction + API call
│       └── types/
│           └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── app-layout.tsx               # Two-panel layout shell
│   │   └── reset-database-button.tsx    # Visible reset button
│   └── types/
│       └── index.ts
│
app/
├── page.tsx                              # Main page composing all features
├── api/
│   └── explain/
│       └── route.ts                      # AI explanation API route (server-side)
```

**Structure Decision**: Screaming Architecture under `src/features/` with four clear features: `sql-engine`, `editor`, `visualizer`, `ai-assistant`. Shared layout components in `src/shared/`. Next.js App Router `app/` folder kept for routing and API routes only.

## Complexity Tracking

No violations detected. All decisions align with constitution principles.
