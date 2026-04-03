export interface ExplainRequest {
  query: string
  error?: string | null
}

export interface ExplainResponse {
  explanation: string
}

export interface ExplanationState {
  explanation: string | null
  isLoading: boolean
  error: string | null
}
