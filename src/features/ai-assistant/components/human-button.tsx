"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { AiBrain01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

interface HumanButtonProps {
  onClick: () => void
  isLoading: boolean
}

export const HumanButton = ({ onClick, isLoading }: HumanButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="gap-1.5 text-xs"
    >
      {isLoading ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          Pensando…
        </>
      ) : (
        <>
          <HugeiconsIcon icon={AiBrain01Icon} size={14} color="currentColor" />
          Explícame
        </>
      )}
    </Button>
  )
}
