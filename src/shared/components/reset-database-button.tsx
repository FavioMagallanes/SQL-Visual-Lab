"use client"

import { useCallback, useState } from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import { RotateClockwiseIcon } from "@hugeicons/core-free-icons"

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
          <HugeiconsIcon icon={RotateClockwiseIcon} size={14} color="currentColor" />
          Reiniciar BD
        </>
      )}
    </Button>
  )
}
