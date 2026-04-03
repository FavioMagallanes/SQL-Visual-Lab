"use client"

import type { KeyboardEvent } from "react"

import type { SqlEditorProps } from "@/src/features/editor/types"

export const SqlEditor = ({
  value,
  onChange,
  onExecute,
  disabled = false,
}: SqlEditorProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      onExecute?.()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Editor SQL
        </span>
        <div className="flex items-center gap-2">
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block">
            Ctrl+Enter
          </kbd>
          <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            SQLite
          </span>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Escribe tu consulta SQL aquí..."
        className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}
