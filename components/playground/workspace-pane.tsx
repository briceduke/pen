"use client"

import type { ReactNode } from "react"

import { PaneHeader } from "@/components/playground/pane-header"
import { cn } from "@/lib/utils"
import type { PaneTone } from "@/lib/playground/types"

export interface WorkspacePaneProps {
  readonly title: string
  readonly tone?: PaneTone
  readonly isActive?: boolean
  readonly trailing?: ReactNode
  readonly children: ReactNode
}

export function WorkspacePane({
  title,
  tone,
  isActive = false,
  trailing,
  children,
}: WorkspacePaneProps) {
  return (
    <section
      aria-label={title}
      data-active={isActive ? "true" : undefined}
      className={cn(
        "flex h-full min-h-0 flex-col bg-background transition-[box-shadow] duration-200 motion-reduce:transition-none",
        isActive && "ring-1 ring-inset ring-ring/60"
      )}
    >
      <PaneHeader
        title={title}
        tone={tone}
        isActive={isActive}
        trailing={trailing}
      />
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}
