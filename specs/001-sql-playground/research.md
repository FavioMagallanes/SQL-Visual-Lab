# Research: SQL Visual Playground

**Branch**: `001-sql-playground` | **Date**: April 3, 2026

## Research Task 1: sql.js Lifecycle in Next.js App Router

### Decision

Load sql.js dynamically on the client side using `next/dynamic` with `ssr: false` or a lazy `useEffect` initialization. The `SQL.Database` instance is managed as a singleton ref inside a Zustand store, initialized once on mount, and explicitly closed via `db.close()` on unmount to prevent memory leaks.

### Rationale

- sql.js requires loading a WASM binary (`sql-wasm.wasm`), which must happen in the browser.
- Next.js App Router uses Server Components by default. sql.js **cannot** run server-side — all sql.js code must be in `"use client"` components or hooks.
- The WASM file must be served from `/public/` or a CDN and referenced via `locateFile`.
- `SQL.Database` allocates memory in the WASM heap. If not closed, the memory is **never** garbage collected by JS. Calling `db.close()` frees the WASM heap.
- React 19 Strict Mode double-mounts in dev. The init/cleanup pattern must be idempotent: init in `useEffect`, close in cleanup.
- Storing the DB instance in a Zustand store (via a non-reactive ref pattern) avoids re-renders on DB instance changes while keeping it accessible across features.

### Alternatives Considered

1. **Web Worker for sql.js**: Moves SQL execution off the main thread. Adds complexity (message passing, serialization). Rejected for v1 — dataset is small (~200 rows), queries execute in < 10ms. Can be added later if performance degrades.
2. **absurd-sql (IndexedDB backend)**: Persistent storage across sessions. Rejected — spec explicitly requires ephemeral data that resets on refresh.
3. **PGlite (PostgreSQL in WASM)**: More complete SQL dialect. Rejected — larger bundle (~3MB vs ~1MB for sql.js), slower init, overkill for a learning tool.

### Implementation Pattern

```typescript
// Non-reactive DB ref pattern in Zustand
interface SqlState {
  isReady: boolean;
  results: QueryResult | null;
  error: string | null;
  queryType: QueryType | null;
  // Actions
  initDatabase: () => Promise<void>;
  executeQuery: (sql: string) => void;
  resetDatabase: () => Promise<void>;
  destroyDatabase: () => void;
}

// DB instance stored outside Zustand reactive state (as module-level ref)
// to avoid triggering re-renders when the instance mutates internally
let dbInstance: Database | null = null;
```

---

## Research Task 2: Query Type Detection for Animation Triggers

### Decision

Implement a lightweight SQL parser using regex-based detection on the trimmed, uppercased query string. Map detected command types to animation variants in Framer Motion.

### Rationale

- Full SQL parsing is overkill. We only need to detect the top-level command (SELECT, INSERT, UPDATE, DELETE, JOIN presence, DROP/ALTER for blocking).
- The parser runs synchronously before query execution, so it must be fast (< 1ms).
- JOIN detection checks for the keyword `JOIN` anywhere in a SELECT statement.
- DROP/ALTER detection blocks execution before it reaches sql.js.

### Query Type Mapping

| SQL Command      | QueryType Enum | Animation Behavior                          |
| ---------------- | -------------- | ------------------------------------------- |
| SELECT (no JOIN) | `SELECT`       | Highlight selected columns                  |
| SELECT ... JOIN  | `JOIN`         | Color-code columns by source table          |
| DELETE           | `DELETE`       | Fade-out affected rows before removal       |
| INSERT           | `INSERT`       | Flash/highlight new rows                    |
| UPDATE           | `UPDATE`       | Flash/highlight changed cells               |
| DROP / ALTER     | `BLOCKED`      | Show friendly error message, do not execute |

### Alternatives Considered

1. **sql.js `EXPLAIN` output**: Parse the query plan to detect operation type. More accurate but adds an extra query per execution. Rejected — regex is sufficient for the command types we support.
2. **Full SQL parser (e.g., node-sql-parser)**: Accurate AST. Adds ~100KB to bundle. Rejected — overkill for detecting 6 command types.

---

## Research Task 3: Framer Motion Animation Strategy for Table Rows

### Decision

Use `AnimatePresence` with `motion.tr` elements inside the results table. Each row gets a unique `key` based on a composite of its data. DELETE operations update state to remove rows, and `AnimatePresence` handles the exit animation. JOIN/SELECT use CSS-based column highlighting with Framer Motion `animate` for smooth transitions.

### Rationale

- `AnimatePresence` is the standard Framer Motion pattern for exit animations — it detects when children unmount and plays their `exit` animation before removal.
- Table rows need stable keys for `AnimatePresence` to track them correctly. Using a hash of row data or row index + primary key.
- For DELETE: compare previous results with new results, mark removed rows, animate exit.
- For JOIN: detect source table per column via query metadata from sql.js, assign color class.
- For SELECT with specific columns: compare selected column names against all available columns, apply highlight class.

### Animation Variants

```typescript
const rowVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
};
```

### Alternatives Considered

1. **CSS-only animations**: Simpler but cannot animate unmounting elements (exit animations). Rejected.
2. **React Spring**: Similar capabilities. Rejected — Framer Motion has better `AnimatePresence` support and is more widely used with React 19.

---

## Research Task 4: AI Explanation Service Architecture

### Decision

Use a Next.js API route (`/api/explain`) that receives the SQL query + error (if any) + result summary, and calls an external AI API (OpenAI-compatible) with a system prompt in Spanish. The client calls this via a simple fetch from the `useQueryExplanation` hook.

### Rationale

- API keys must never be exposed client-side. The API route acts as a secure proxy.
- The system prompt instructs the AI to respond in Spanish, using simple language for non-technical users.
- The explanation request includes: the SQL query, whether it succeeded or errored, the error message (if any), and a summary of the result (row count, column names).
- Streaming is deferred to v2; v1 returns a complete response.

### Alternatives Considered

1. **Client-side AI (WebLLM, transformers.js)**: No API key needed. Rejected — large model downloads (hundreds of MB), inconsistent quality, slow on low-end devices.
2. **Vercel AI SDK**: Nice streaming support. Considered for v2. For v1, a simple fetch to the API route is sufficient and avoids an extra dependency.

---

## Research Task 5: WASM Binary Hosting Strategy

### Decision

Copy `sql-wasm.wasm` to the `/public/` directory during the build/install step. Configure sql.js `locateFile` to point to `/sql-wasm.wasm`.

### Rationale

- sql.js WASM binary (~1MB) must be accessible via a URL at runtime.
- Hosting from `/public/` is the simplest approach for Next.js — files in `/public/` are served statically.
- A `postinstall` script in `package.json` can copy the file from `node_modules/sql.js/dist/sql-wasm.wasm` to `public/`.

### Alternatives Considered

1. **CDN (sql.js.org)**: No local copy needed. Rejected — adds external dependency, fails offline, slower first load.
2. **Webpack asset import**: Bundle the WASM inline. Rejected — increases JS bundle size, complicates build config.
