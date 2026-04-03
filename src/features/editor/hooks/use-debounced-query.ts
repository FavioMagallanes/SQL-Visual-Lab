"use client"

import { useEffect, useRef } from "react"

import { useSqlStore } from "@/src/features/sql-engine/store/sql-store"

const DEBOUNCE_MS = 300

export const useDebouncedQuery = (query: string) => {
  const executeQuery = useSqlStore((s) => s.executeQuery)
  const isReady = useSqlStore((s) => s.isReady)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isReady) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      executeQuery(query)
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [query, executeQuery, isReady])
}
