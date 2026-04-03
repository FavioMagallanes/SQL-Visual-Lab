"use client"

import type { ReactNode } from "react"

interface AppLayoutProps {
  editor: ReactNode
  results: ReactNode
  toolbar?: ReactNode
}

export const AppLayout = ({ editor, results, toolbar }: AppLayoutProps) => {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {toolbar && (
        <header className="flex items-center justify-between border-b px-4 py-2">
          {toolbar}
        </header>
      )}
      <main className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <section className="flex h-1/2 flex-col border-b md:h-auto md:w-1/2 md:border-r md:border-b-0">
          {editor}
        </section>
        <section className="flex h-1/2 flex-col md:h-auto md:w-1/2">
          {results}
        </section>
      </main>
    </div>
  )
}
