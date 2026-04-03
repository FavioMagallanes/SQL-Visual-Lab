import type { Database } from "sql.js"
import { create } from "zustand"

import {
  createDatabase,
  destroyDatabase,
  executeSQL,
} from "@/src/features/sql-engine/lib/database-manager"
import {
  getBlockedMessage,
  isBlockedQuery,
  parseQueryType,
} from "@/src/features/sql-engine/lib/query-parser"
import { DEFAULT_QUERY, type SqlStore } from "@/src/features/sql-engine/types"

let dbInstance: Database | null = null

export const useSqlStore = create<SqlStore>((set, get) => ({
  isReady: false,
  isLoading: false,
  results: null,
  previousResults: null,
  error: null,
  queryType: null,
  currentQuery: DEFAULT_QUERY,

  initDatabase: async () => {
    set({ isLoading: true, error: null })

    try {
      if (dbInstance) {
        destroyDatabase(dbInstance)
      }

      dbInstance = await createDatabase()

      set({ isReady: true, isLoading: false })

      get().executeQuery(DEFAULT_QUERY)
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : "Failed to initialize database",
      })
    }
  },

  executeQuery: (sql: string) => {
    const trimmed = sql.trim()

    if (!trimmed) {
      set({ results: null, error: null, queryType: null, currentQuery: sql })
      return
    }

    if (isBlockedQuery(trimmed)) {
      set({
        error: getBlockedMessage(trimmed),
        queryType: "BLOCKED",
        currentQuery: sql,
      })
      return
    }

    if (!dbInstance) {
      set({ error: "Database not initialized" })
      return
    }

    const queryType = parseQueryType(trimmed)

    try {
      const currentResults = get().results
      const results = executeSQL(dbInstance, trimmed)

      set({
        previousResults: currentResults,
        results,
        error: null,
        queryType,
        currentQuery: sql,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Query execution failed",
        queryType,
        currentQuery: sql,
      })
    }
  },

  resetDatabase: async () => {
    set({ isLoading: true, error: null })

    try {
      if (dbInstance) {
        destroyDatabase(dbInstance)
      }

      dbInstance = await createDatabase()

      set({
        isReady: true,
        isLoading: false,
        results: null,
        previousResults: null,
        error: null,
        queryType: null,
        currentQuery: DEFAULT_QUERY,
      })

      get().executeQuery(DEFAULT_QUERY)
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to reset database",
      })
    }
  },

  destroyDatabase: () => {
    if (dbInstance) {
      destroyDatabase(dbInstance)
      dbInstance = null
    }

    set({
      isReady: false,
      isLoading: false,
      results: null,
      previousResults: null,
      error: null,
      queryType: null,
      currentQuery: DEFAULT_QUERY,
    })
  },
}))
