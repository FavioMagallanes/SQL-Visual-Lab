"use client"

import { useCallback } from "react"

import { useSqlStore } from "@/src/features/sql-engine/store/sql-store"

export const useQueryExecutor = () => {
  const executeQuery = useSqlStore((s) => s.executeQuery)

  const execute = useCallback(
    (sql: string) => {
      executeQuery(sql)
    },
    [executeQuery]
  )

  return { execute }
}
