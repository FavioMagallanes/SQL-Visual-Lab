"use client"

import { useCallback, useState } from "react"

import { fetchExplanation } from "@/src/features/ai-assistant/lib/explanation-service"
import type { ExplanationState } from "@/src/features/ai-assistant/types"

export const useQueryExplanation = () => {
  const [state, setState] = useState<ExplanationState>({
    explanation: null,
    isLoading: false,
    error: null,
  })

  const explain = useCallback(async (query: string, error?: string | null) => {
    setState({ explanation: null, isLoading: true, error: null })

    try {
      const response = await fetchExplanation({ query, error })
      setState({
        explanation: response.explanation,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState({
        explanation: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      })
    }
  }, [])

  const clear = useCallback(() => {
    setState({ explanation: null, isLoading: false, error: null })
  }, [])

  return { ...state, explain, clear }
}
