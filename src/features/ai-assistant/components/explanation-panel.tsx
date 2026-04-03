"use client"

import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

interface ExplanationPanelProps {
  explanation: string | null
  isLoading: boolean
  error: string | null
  onClose: () => void
}

export const ExplanationPanel = ({
  explanation,
  isLoading,
  error,
  onClose,
}: ExplanationPanelProps) => {
  const isVisible = isLoading || explanation !== null || error !== null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden border-t"
        >
          <div className="bg-muted/20 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    Analizando tu consulta…
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                {explanation && !isLoading && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {explanation}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                aria-label="Cerrar explicación"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
