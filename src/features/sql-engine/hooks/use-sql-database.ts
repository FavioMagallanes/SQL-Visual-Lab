"use client"

import { useEffect } from "react"

import { useSqlStore } from "@/src/features/sql-engine/store/sql-store"

export const useSqlDatabase = () => {
  const isReady = useSqlStore((s) => s.isReady)
  const isLoading = useSqlStore((s) => s.isLoading)
  const error = useSqlStore((s) => s.error)
  const initDatabase = useSqlStore((s) => s.initDatabase)
  const destroyDatabase = useSqlStore((s) => s.destroyDatabase)

  useEffect(() => {
    initDatabase()

    return () => {
      destroyDatabase()
    }
  }, [initDatabase, destroyDatabase])

  return { isReady, isLoading, error }
}
