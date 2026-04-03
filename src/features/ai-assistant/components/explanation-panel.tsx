"use client"

import { AnimatePresence, motion } from "framer-motion"

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
              <button
                onClick={onClose}
                className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Cerrar explicación"
              >
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
