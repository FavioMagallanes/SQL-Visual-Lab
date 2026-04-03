"use client"

import { useMemo } from "react"
import type { Variants } from "framer-motion"

import type { QueryType } from "@/src/features/sql-engine/types"

export interface AnimationConfig {
  row: Variants
  cell: Variants
}

const fadeIn: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
}

const fadeOut: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4 } },
}

const slideIn: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
}

const highlight: Variants = {
  initial: { backgroundColor: "rgba(0,0,0,0)" },
  animate: {
    backgroundColor: ["hsl(var(--primary) / 0.12)", "rgba(0,0,0,0)"],
    transition: { duration: 1.2, ease: "easeOut" },
  },
  exit: { backgroundColor: "rgba(0,0,0,0)" },
}

const neutral: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
}

const QUERY_TYPE_CONFIG: Record<string, AnimationConfig> = {
  SELECT: { row: fadeIn, cell: highlight },
  INSERT: { row: slideIn, cell: highlight },
  UPDATE: { row: fadeIn, cell: highlight },
  DELETE: { row: fadeOut, cell: neutral },
  JOIN: { row: fadeIn, cell: highlight },
  BLOCKED: { row: neutral, cell: neutral },
  UNKNOWN: { row: fadeIn, cell: neutral },
}

const DEFAULT_CONFIG: AnimationConfig = {
  row: fadeIn,
  cell: neutral,
}

export const useAnimationConfig = (
  queryType: QueryType | null
): AnimationConfig => {
  return useMemo(() => {
    if (!queryType) return DEFAULT_CONFIG
    return QUERY_TYPE_CONFIG[queryType] ?? DEFAULT_CONFIG
  }, [queryType])
}
