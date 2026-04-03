"use client"

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
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          Explícame
        </>
      )}
    </Button>
  )
}
