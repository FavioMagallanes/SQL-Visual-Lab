"use client"

import { AnimatePresence } from "framer-motion"

import { AnimatedRow } from "@/src/features/visualizer/components/animated-row"
import { ColumnHighlight } from "@/src/features/visualizer/components/column-highlight"
import type { ResultsTableProps } from "@/src/features/visualizer/types"

const MAX_DISPLAY_ROWS = 100

export const ResultsTable = ({
  results,
  queryType,
  isLoading = false,
}: ResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <span className="text-sm">Cargando base de datos…</span>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Escribe una consulta SQL para ver los resultados aquí.
        </p>
      </div>
    )
  }

  if (results.columns.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <p className="text-sm font-medium">
            Consulta ejecutada correctamente
          </p>
          <p className="text-xs">
            {results.affectedRows > 0
              ? `${results.affectedRows} fila(s) afectada(s)`
              : "Sin resultados para mostrar"}
          </p>
        </div>
      </div>
    )
  }

  const displayRows = results.values.slice(0, MAX_DISPLAY_ROWS)
  const isTruncated = results.values.length > MAX_DISPLAY_ROWS

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Resultados
        </span>
        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {results.rowCount} fila{results.rowCount !== 1 ? "s" : ""}
          {isTruncated && ` (mostrando ${MAX_DISPLAY_ROWS})`}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <tr>
              {results.columns.map((column, columnIndex) => (
                <ColumnHighlight
                  key={column}
                  column={column}
                  columnIndex={columnIndex}
                  queryType={queryType}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {displayRows.map((row, rowIndex) => (
                <AnimatedRow
                  key={`row-${rowIndex}-${row[0]}`}
                  values={row}
                  columns={results.columns}
                  rowIndex={rowIndex}
                  queryType={queryType}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
