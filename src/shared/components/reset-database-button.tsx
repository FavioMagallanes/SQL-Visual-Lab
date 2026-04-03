"use client"

import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { useSqlStore } from "@/src/features/sql-engine/store/sql-store"

export const ResetDatabaseButton = ({ onReset }: { onReset?: () => void }) => {
  const resetDatabase = useSqlStore((s) => s.resetDatabase)
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = useCallback(async () => {
    setIsResetting(true)

    try {
      await resetDatabase()
      onReset?.()
    } finally {
      setIsResetting(false)
    }
  }, [resetDatabase, onReset])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      className="gap-1.5 text-xs"
    >
      {isResetting ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          Reiniciando…
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Reiniciar BD
        </>
      )}
    </Button>
  )
}
