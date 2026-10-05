"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, TerminalIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConsoleLevel, ConsoleMessage } from "@/lib/playground/types"

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

export function ConsolePanel({
  messages,
  onClearMessages,
}: ConsolePanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-card">
      <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <HugeiconsIcon icon={TerminalIcon} />
          Console
        </div>
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
      </header>
      {messages.length === 0 ? (
        <Empty className="min-h-0 flex-1 border-0 p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={TerminalIcon} />
            </EmptyMedia>
            <EmptyTitle>No console output</EmptyTitle>
            <EmptyDescription>
              console.log, warnings, and runtime errors from the preview appear
              here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ol className="flex flex-col gap-1 p-2 font-mono text-xs">
            {messages.map((message) => (
              <li
                key={message.id}
                className="flex items-start gap-2 rounded-xl px-2 py-1.5"
              >
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
