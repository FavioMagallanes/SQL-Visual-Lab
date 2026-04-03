import { NextResponse } from "next/server"

import type {
  ExplainRequest,
  ExplainResponse,
} from "@/src/features/ai-assistant/types"

const SYSTEM_PROMPT = `Eres un tutor de SQL amable y paciente que explica consultas SQL a principiantes.

REGLAS:
- Responde SIEMPRE en español.
- Usa un lenguaje simple y accesible, como si hablaras con alguien que nunca ha usado SQL.
- Explica paso a paso qué hace la consulta.
- Si hay un error, explica qué salió mal y cómo corregirlo.
- Usa analogías cotidianas cuando sea posible (ej: "Es como buscar en una lista de contactos...").
- Limita tu respuesta a 3-5 oraciones claras.
- No uses jerga técnica innecesaria.
- Si la consulta está vacía, sugiere una consulta de ejemplo para empezar.`

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as ExplainRequest
    const { query, error } = body

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json<ExplainResponse>(
        {
          explanation:
            "🤖 El servicio de explicaciones no está disponible en este momento. Configura tu clave de API de OpenAI en el archivo `.env.local` para habilitar esta función.",
        },
        { status: 200 }
      )
    }

    const userMessage = error
      ? `El usuario ejecutó esta consulta SQL y obtuvo un error:\n\nConsulta: ${query}\nError: ${error}\n\nExplica qué salió mal y cómo corregirlo.`
      : query.trim()
        ? `Explica esta consulta SQL de forma simple:\n\n${query}`
        : "El editor está vacío. Sugiere una consulta SQL de ejemplo para empezar a practicar con las tablas disponibles: characters (personajes de Star Wars), teams (equipos de Champions League) y fan_clubs (relación entre personajes y equipos)."

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", errorText)
      return NextResponse.json<ExplainResponse>(
        {
          explanation:
            "⚠️ Hubo un problema al conectar con el servicio de IA. Verifica tu clave de API e intenta de nuevo.",
        },
        { status: 200 }
      )
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[]
    }

    const explanation =
      data.choices[0]?.message?.content ?? "No se pudo generar una explicación."

    return NextResponse.json<ExplainResponse>({ explanation })
  } catch (err) {
    console.error("Explain API error:", err)
    return NextResponse.json<ExplainResponse>(
      {
        explanation:
          "⚠️ Ocurrió un error inesperado. Intenta de nuevo en unos segundos.",
      },
      { status: 200 }
    )
  }
}
