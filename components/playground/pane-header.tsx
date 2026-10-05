"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { PaneTone } from "@/lib/playground/types"

export interface PaneHeaderProps {
  readonly title: string
  readonly tone?: PaneTone
  readonly isActive?: boolean
  readonly trailing?: ReactNode
}

function toneClassName(tone: PaneTone | undefined): string {
  if (tone === "html") {
    return "bg-chart-3"
  }
  if (tone === "css") {
    return "bg-chart-2"
  }
  if (tone === "javascript") {
    return "bg-chart-4"
  }
  if (tone === "preview") {
    return "bg-primary"
  }
  if (tone === "console") {
    return "bg-muted-foreground"
  }
  return "bg-border"
}

export function PaneHeader({
  title,
  tone,
  isActive = false,
  trailing,
}: PaneHeaderProps) {
  return (
    <header className="flex h-8 shrink-0 items-center justify-between gap-2 border-b bg-card/40 px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", toneClassName(tone))}
        />
        <span
          className={cn(
            "text-xs font-medium tracking-wider uppercase",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </span>
      </div>
      {trailing}
    </header>
  )
}
