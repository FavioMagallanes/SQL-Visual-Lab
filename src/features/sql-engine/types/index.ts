export type QueryType =
  | "SELECT"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "JOIN"
  | "BLOCKED"
  | "UNKNOWN"

export interface QueryResult {
  columns: string[]
  values: (string | number | null)[][]
  rowCount: number
  affectedRows: number
}

export interface DatabaseState {
  isReady: boolean
  isLoading: boolean
  results: QueryResult | null
  previousResults: QueryResult | null
  error: string | null
  queryType: QueryType | null
  currentQuery: string
}

export interface SqlActions {
  initDatabase: () => Promise<void>
  executeQuery: (sql: string) => void
  resetDatabase: () => Promise<void>
  destroyDatabase: () => void
}

export type SqlStore = DatabaseState & SqlActions

export const DEFAULT_QUERY = "SELECT * FROM characters;"

export const BLOCKED_COMMANDS = ["DROP", "ALTER", "CREATE", "TRUNCATE"] as const

export type BlockedCommand = (typeof BLOCKED_COMMANDS)[number]
