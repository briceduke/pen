"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, TerminalIcon } from "@hugeicons/core-free-icons"
import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import {
  countConsoleByLevel,
  filterConsoleMessages,
  isConsoleFilter,
} from "@/lib/playground/console-filter"
import { cn } from "@/lib/utils"
import type {
  ConsoleFilter,
  ConsoleLevel,
  ConsoleMessage,
} from "@/lib/playground/types"

export interface ConsolePanelProps {
  readonly messages: readonly ConsoleMessage[]
  readonly onClearMessages: () => void
}

function badgeVariantForLevel(
  level: ConsoleLevel
): "secondary" | "outline" | "destructive" {
  if (level === "error") {
    return "destructive"
  }
  if (level === "warn") {
    return "outline"
  }
  return "secondary"
}

function formatConsoleTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(timestamp)
}

export function ConsolePanel({
  messages,
  onClearMessages,
}: ConsolePanelProps) {
  const [filter, setFilter] = useState<ConsoleFilter>("all")
  const prefersReducedMotion = usePrefersReducedMotion()
  const endRef = useRef<HTMLLIElement | null>(null)
  const visible = filterConsoleMessages(messages, filter)
  const counts = countConsoleByLevel(messages)

  useEffect(() => {
    endRef.current?.scrollIntoView({
      block: "end",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }, [visible, prefersReducedMotion])

  return (
    <section
      className="flex h-full min-h-0 flex-col bg-card"
      aria-label="Console"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-2 py-1.5">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
          <HugeiconsIcon icon={TerminalIcon} />
          Console
          {counts.error > 0 ? (
            <Badge variant="destructive">{counts.error}</Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={filter}
            onValueChange={(value) => {
              if (isConsoleFilter(value)) {
                setFilter(value)
              }
            }}
            aria-label="Filter console messages"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="log">Logs</ToggleGroupItem>
            <ToggleGroupItem value="warn">Warn</ToggleGroupItem>
            <ToggleGroupItem value="error">Error</ToggleGroupItem>
          </ToggleGroup>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearMessages}
            disabled={messages.length === 0}
          >
            <HugeiconsIcon icon={Delete02Icon} data-icon="inline-start" />
            Clear
          </Button>
        </div>
      </header>
      {visible.length === 0 ? (
        <Empty className="min-h-0 flex-1 border-0 py-6">
          <EmptyHeader>
            <EmptyTitle className="text-sm">
              {messages.length === 0 ? "No output" : "No matching logs"}
            </EmptyTitle>
            <EmptyDescription>
              console.log, warnings, and runtime errors from the preview appear
              here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ol className="flex flex-col gap-1 p-2 font-mono text-xs" role="log">
            {visible.map((message, index) => (
              <li
                key={message.id}
                ref={index === visible.length - 1 ? endRef : undefined}
                className={cn(
                  "flex items-start gap-2 rounded-xl px-2 py-1.5",
                  message.level === "error" && "bg-destructive/10",
                  message.level === "warn" && "bg-muted/70"
                )}
              >
                <time
                  dateTime={new Date(message.timestamp).toISOString()}
                  className="shrink-0 pt-0.5 text-[10px] text-muted-foreground tabular-nums"
                >
                  {formatConsoleTime(message.timestamp)}
                </time>
                <Badge variant={badgeVariantForLevel(message.level)}>
                  {message.level}
                </Badge>
                <pre className="min-w-0 flex-1 whitespace-pre-wrap break-all text-foreground">
                  {message.args.join(" ")}
                </pre>
              </li>
            ))}
          </ol>
        </ScrollArea>
      )}
    </section>
  )
}
