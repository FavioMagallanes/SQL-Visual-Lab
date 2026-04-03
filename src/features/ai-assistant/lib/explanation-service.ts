import type {
  ExplainRequest,
  ExplainResponse,
} from "@/src/features/ai-assistant/types"

export const fetchExplanation = async (
  request: ExplainRequest
): Promise<ExplainResponse> => {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Error al obtener la explicación")
  }

  return response.json() as Promise<ExplainResponse>
}
