# Quickstart: SQL Visual Playground

**Branch**: `001-sql-playground` | **Date**: April 3, 2026

## Prerequisites

- Node.js 20+
- pnpm 9+
- Modern browser (Chrome, Firefox, Safari, Edge)

## Setup

```bash
# 1. Install new dependencies
pnpm add zustand sql.js framer-motion

# 2. Copy WASM binary to public folder
cp node_modules/sql.js/dist/sql-wasm.wasm public/sql-wasm.wasm

# 3. Start dev server
pnpm dev
```

## Key Directories

| Path                         | Purpose                                                |
| ---------------------------- | ------------------------------------------------------ |
| `src/features/sql-engine/`   | sql.js wrapper, Zustand store, query parser, seed data |
| `src/features/editor/`       | SQL text editor with debounced execution               |
| `src/features/visualizer/`   | Results table with Framer Motion animations            |
| `src/features/ai-assistant/` | "The Human Button" + explanation panel                 |
| `src/shared/`                | Layout shell, reset button                             |
| `app/api/explain/`           | AI explanation API route                               |

## Development Flow

1. **SQL Engine** must be implemented first (P1 foundation)
2. **Editor** depends on sql-engine store
3. **Visualizer** depends on sql-engine store (results + queryType)
4. **AI Assistant** is independent (P3), can be developed in parallel after editor

## Environment Variables

```env
# Required for "The Human Button" (P3 feature)
OPENAI_API_KEY=sk-...
```

## Architecture Rules (Constitution)

- All files: `kebab-case`
- All exports: `export const` with arrow functions
- No `any`, no `forwardRef`
- Components are presentational; logic lives in hooks/stores
- Commits: Conventional Commits in English
