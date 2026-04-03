"use client"

import { motion } from "framer-motion"

import type { AnimatedRowProps } from "@/src/features/visualizer/types"
import { useAnimationConfig } from "@/src/features/visualizer/hooks/use-animation-config"

export const AnimatedRow = ({
  values,
  columns,
  rowIndex,
  queryType,
}: AnimatedRowProps) => {
  const { row: rowVariants, cell: cellVariants } = useAnimationConfig(queryType)

  return (
    <motion.tr
      layout
      variants={rowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, delay: rowIndex * 0.03 }}
      className="border-b transition-colors hover:bg-muted/40"
    >
      {values.map((cell, cellIndex) => (
        <motion.td
          key={`${columns[cellIndex]}-${cellIndex}`}
          variants={cellVariants}
          className="px-4 py-2 font-mono text-xs whitespace-nowrap"
        >
          {cell === null ? (
            <span className="text-muted-foreground/50 italic">NULL</span>
          ) : (
            String(cell)
          )}
        </motion.td>
      ))}
    </motion.tr>
  )
}
