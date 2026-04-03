"use client"

import { useCallback, useState } from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"

import { ExplanationPanel } from "@/src/features/ai-assistant/components/explanation-panel"
import { HumanButton } from "@/src/features/ai-assistant/components/human-button"
import { useQueryExplanation } from "@/src/features/ai-assistant/hooks/use-query-explanation"
import { useDebouncedQuery } from "@/src/features/editor/hooks/use-debounced-query"
import { SqlEditor } from "@/src/features/editor/components/sql-editor"
import { useSqlDatabase } from "@/src/features/sql-engine/hooks/use-sql-database"
import { useSqlStore } from "@/src/features/sql-engine/store/sql-store"
import { DEFAULT_QUERY } from "@/src/features/sql-engine/types"
import { ResultsTable } from "@/src/features/visualizer/components/results-table"
import { AppLayout } from "@/src/shared/components/app-layout"
import { ResetDatabaseButton } from "@/src/shared/components/reset-database-button"

export default function Page() {
  const { isReady, isLoading } = useSqlDatabase()
  const results = useSqlStore((s) => s.results)
  const previousResults = useSqlStore((s) => s.previousResults)
  const queryType = useSqlStore((s) => s.queryType)
  const error = useSqlStore((s) => s.error)

  const executeQuery = useSqlStore((s) => s.executeQuery)

  const [query, setQuery] = useState(DEFAULT_QUERY)

  const {
    explanation,
    isLoading: isExplaining,
    error: explanationError,
    explain,
    clear: clearExplanation,
  } = useQueryExplanation()

  useDebouncedQuery(query)

  const handleReset = () => {
    setQuery(DEFAULT_QUERY)
    clearExplanation()
  }

  const handleExecute = useCallback(() => {
    executeQuery(query)
  }, [executeQuery, query])

  const handleExplain = () => {
    explain(query, error)
  }

  return (
    <AppLayout
      toolbar={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold tracking-tight">
              SQL Visual Lab
            </h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Playground
            </span>
          </div>
          <ResetDatabaseButton onReset={handleReset} />
        </div>
      }
      editor={
        <div className="flex h-full flex-col">
          <SqlEditor
            value={query}
            onChange={setQuery}
            onExecute={handleExecute}
            disabled={!isReady}
          />
          <div className="flex items-center gap-2 border-t px-4 py-2">
            <HumanButton onClick={handleExplain} isLoading={isExplaining} />
          </div>
          <ExplanationPanel
            explanation={explanation}
            isLoading={isExplaining}
            error={explanationError}
            onClose={clearExplanation}
          />
          {error && (
            <div className="border-t bg-destructive/5 px-4 py-3">
              <div className="flex items-start gap-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={14}
                  color="currentColor"
                  className="mt-0.5 shrink-0 text-destructive"
                />
                <p className="text-xs leading-relaxed text-destructive">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      }
      results={
        <ResultsTable
          results={results}
          previousResults={previousResults}
          queryType={queryType}
          isLoading={isLoading}
        />
      }
    />
  )
}
