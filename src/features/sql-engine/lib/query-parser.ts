import {
  BLOCKED_COMMANDS,
  type QueryType,
} from "@/src/features/sql-engine/types"

export const parseQueryType = (sql: string): QueryType => {
  const trimmed = sql.trim().toUpperCase()

  if (!trimmed) {
    return "UNKNOWN"
  }

  const firstWord = trimmed.split(/\s+/)[0]

  if (
    BLOCKED_COMMANDS.includes(firstWord as (typeof BLOCKED_COMMANDS)[number])
  ) {
    return "BLOCKED"
  }

  if (firstWord === "DELETE") {
    return "DELETE"
  }

  if (firstWord === "INSERT") {
    return "INSERT"
  }

  if (firstWord === "UPDATE") {
    return "UPDATE"
  }

  if (firstWord === "SELECT") {
    const hasJoin = /\bJOIN\b/i.test(sql)
    return hasJoin ? "JOIN" : "SELECT"
  }

  return "UNKNOWN"
}

export const isBlockedQuery = (sql: string): boolean => {
  return parseQueryType(sql) === "BLOCKED"
}

export const getBlockedMessage = (sql: string): string => {
  const firstWord = sql.trim().split(/\s+/)[0]?.toUpperCase() ?? ""
  return `La operación "${firstWord}" no está permitida. Este playground está diseñado para practicar SELECT, INSERT, UPDATE, DELETE y JOIN. Usa el botón "Reset Database" si necesitas restaurar los datos.`
}

/**
 * Extracts source table names from a JOIN query for column coloring.
 * Returns an array of table names/aliases in the order they appear.
 */
export const extractJoinTables = (sql: string): string[] => {
  const tables: string[] = []

  const fromMatch = sql.match(/\bFROM\s+(\w+)/i)
  if (fromMatch) {
    tables.push(fromMatch[1])
  }

  const joinMatches = sql.matchAll(/\bJOIN\s+(\w+)/gi)
  for (const match of joinMatches) {
    tables.push(match[1])
  }

  return tables
}
