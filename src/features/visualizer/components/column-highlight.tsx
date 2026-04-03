"use client"

import { motion } from "framer-motion"

import type { ColumnHighlightProps } from "@/src/features/visualizer/types"

const JOIN_COLORS = [
  "hsl(var(--chart-1) / 0.15)",
  "hsl(var(--chart-2) / 0.15)",
  "hsl(var(--chart-3) / 0.15)",
  "hsl(var(--chart-4) / 0.15)",
  "hsl(var(--chart-5) / 0.15)",
]

const getJoinColor = (columnIndex: number): string => {
  return JOIN_COLORS[columnIndex % JOIN_COLORS.length]
}

export const ColumnHighlight = ({
  column,
  columnIndex,
  queryType,
}: ColumnHighlightProps) => {
  const isJoin = queryType === "JOIN"
  const isSelect = queryType === "SELECT"

  return (
    <motion.th
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: columnIndex * 0.05 }}
      className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase"
      style={{
        backgroundColor: isJoin ? getJoinColor(columnIndex) : undefined,
      }}
    >
      <span
        className={
          isSelect ? "text-primary" : isJoin ? "text-foreground" : undefined
        }
      >
        {column}
      </span>
    </motion.th>
  )
}
