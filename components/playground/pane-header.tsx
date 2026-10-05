"use client"

import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

export interface PaneHeaderProps {
  readonly title: string
  readonly trailing?: ReactNode
}

export function PaneHeader({ title, trailing }: PaneHeaderProps) {
  return (
    <header className="flex h-9 items-center justify-between gap-2 border-b px-3">
      <Badge variant="outline">{title}</Badge>
      {trailing}
    </header>
  )
}
