# Data Model: SQL Visual Playground

**Branch**: `001-sql-playground` | **Date**: April 3, 2026

## SQLite Tables (In-Memory)

### characters

| Column      | Type    | Constraints                | Description                                         |
| ----------- | ------- | -------------------------- | --------------------------------------------------- |
| id          | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier                                   |
| name        | TEXT    | NOT NULL                   | Character name (e.g., "Luke Skywalker")             |
| affiliation | TEXT    | NOT NULL                   | Faction (e.g., "Rebel Alliance", "Galactic Empire") |
| species     | TEXT    | NOT NULL                   | Species (e.g., "Human", "Wookiee")                  |
| homeworld   | TEXT    | NOT NULL                   | Planet of origin (e.g., "Tatooine")                 |

### teams

| Column  | Type    | Constraints                | Description                              |
| ------- | ------- | -------------------------- | ---------------------------------------- |
| id      | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier                        |
| name    | TEXT    | NOT NULL                   | Team name (e.g., "Real Madrid")          |
| country | TEXT    | NOT NULL                   | Country (e.g., "Spain")                  |
| league  | TEXT    | NOT NULL                   | League name (e.g., "La Liga")            |
| stadium | TEXT    | NOT NULL                   | Stadium name (e.g., "Santiago Bernabéu") |

### fan_clubs

| Column          | Type    | Constraints                  | Description              |
| --------------- | ------- | ---------------------------- | ------------------------ |
| id              | INTEGER | PRIMARY KEY, AUTOINCREMENT   | Unique identifier        |
| character_id    | INTEGER | NOT NULL, FK → characters.id | Reference to character   |
| team_id         | INTEGER | NOT NULL, FK → teams.id      | Reference to team        |
| membership_year | INTEGER | NOT NULL                     | Year joined the fan club |

**Relationships**:

- `fan_clubs.character_id` → `characters.id` (many-to-one)
- `fan_clubs.team_id` → `teams.id` (many-to-one)
- A character can be a fan of multiple teams; a team can have multiple character fans.

## TypeScript Interfaces (Application State)

### QueryResult

```typescript
interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
  rowCount: number;
  affectedRows: number;
}
```

### QueryType

```typescript
type QueryType = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "JOIN" | "BLOCKED" | "UNKNOWN";
```

### DatabaseState

```typescript
interface DatabaseState {
  isReady: boolean;
  isLoading: boolean;
  results: QueryResult | null;
  previousResults: QueryResult | null;
  error: string | null;
  queryType: QueryType | null;
  currentQuery: string;
}
```

### ExplanationState

```typescript
interface ExplanationState {
  isLoading: boolean;
  explanation: string | null;
  error: string | null;
}
```

## State Transitions

```
[App Load] → isLoading=true → initDatabase() → isReady=true → executeQuery(defaultQuery) → results populated
[User Types] → debounce(300ms) → executeQuery(sql) → results updated | error set
[DELETE query] → previousResults saved → query executed → AnimatePresence diffs rows → fade-out exit
[DROP/ALTER] → queryParser detects → BLOCKED → error message shown, query NOT executed
[Reset Button] → destroyDatabase() → initDatabase() → executeQuery(defaultQuery)
[Page Refresh] → destroyDatabase() (cleanup) → full reload → [App Load]
```

## Dataset Size

- `characters`: ~15 rows (iconic Star Wars characters)
- `teams`: ~12 rows (top Champions League teams)
- `fan_clubs`: ~20 rows (fun character-team pairings)
- **Total**: ~47 rows, < 10KB in memory
