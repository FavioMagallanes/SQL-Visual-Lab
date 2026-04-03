import type { QueryResult, QueryType } from "@/src/features/sql-engine/types"

export interface ResultsTableProps {
  results: QueryResult | null
  previousResults?: QueryResult | null
  queryType: QueryType | null
  isLoading?: boolean
}

export interface AnimatedRowProps {
  values: (string | number | null)[]
  columns: string[]
  rowIndex: number
  queryType: QueryType | null
}

export interface ColumnHighlightProps {
  column: string
  columnIndex: number
  queryType: QueryType | null
  sourceTable?: string
}
