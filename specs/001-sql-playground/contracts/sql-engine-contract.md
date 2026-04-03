# Contract: SQL Engine

**Date**: April 3, 2026

## sql-engine feature interface

The SQL engine feature exposes its functionality via a Zustand store and React hooks. No REST API — all communication is in-process via JavaScript.

### Store Interface: `useSqlStore`

```typescript
interface SqlStore {
  // State (read-only from consumers)
  isReady: boolean;
  isLoading: boolean;
  results: QueryResult | null;
  previousResults: QueryResult | null;
  error: string | null;
  queryType: QueryType | null;
  currentQuery: string;

  // Actions
  initDatabase: () => Promise<void>;
  executeQuery: (sql: string) => void;
  resetDatabase: () => Promise<void>;
  destroyDatabase: () => void;
}
```

### Hook Interface: `useSqlDatabase`

```typescript
// Initializes the DB on mount and cleans up on unmount.
// Returns: { isReady: boolean; error: string | null }
const useSqlDatabase: () => { isReady: boolean; error: string | null };
```

### Hook Interface: `useQueryExecutor`

```typescript
// Accepts raw SQL, debounces, and executes via the store.
// Returns: { execute: (sql: string) => void }
const useQueryExecutor: () => { execute: (sql: string) => void };
```

### Hook Interface: `useDebouncedQuery`

```typescript
// Watches editor input, debounces by 300ms, triggers executeQuery.
// Returns: { query: string; setQuery: (sql: string) => void }
const useDebouncedQuery: () => { query: string; setQuery: (sql: string) => void };
```

### API Route: `POST /api/explain`

**Request**:

```typescript
interface ExplainRequest {
  query: string;
  success: boolean;
  error?: string;
  resultSummary?: {
    rowCount: number;
    columns: string[];
  };
}
```

**Response**:

```typescript
interface ExplainResponse {
  explanation: string;
}
```

**Error Response** (4xx/5xx):

```typescript
interface ExplainError {
  error: string;
}
```

### Query Parser Interface

```typescript
// Returns the detected type of SQL command.
// Blocks DROP/ALTER by returning "BLOCKED".
const parseQueryType: (sql: string) => QueryType;
```
