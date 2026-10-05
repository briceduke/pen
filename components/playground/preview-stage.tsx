"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon, SourceCodeIcon } from "@hugeicons/core-free-icons"

import { PreviewFrame } from "@/components/playground/preview-frame"
import { WorkspacePane } from "@/components/playground/workspace-pane"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { ConsoleLevel } from "@/lib/playground/types"

export interface PreviewStageProps {
  readonly srcdoc: string
  readonly loadId: number
  readonly remountId: number
  readonly isEmpty: boolean
  readonly isStale: boolean
  readonly errorCount: number
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
}

export function PreviewStage({
  srcdoc,
  loadId,
  remountId,
  isEmpty,
  isStale,
  errorCount,
  onConsoleMessage,
}: PreviewStageProps) {
  return (
    <WorkspacePane
      title="Preview"
      tone="preview"
      trailing={
        <div className="flex items-center gap-1.5">
          {errorCount > 0 ? (
            <Badge variant="destructive">{errorCount}</Badge>
          ) : null}
          {isStale ? <Badge variant="outline">Not run</Badge> : null}
        </div>
      }
    >
      <div className="relative h-full min-h-0 bg-card">
        <PreviewFrame
          srcdoc={srcdoc}
          loadId={loadId}
          remountId={remountId}
          onConsoleMessage={onConsoleMessage}
        />
        {isEmpty ? (
          <div className="absolute inset-0 bg-card">
            <Empty className="h-full min-h-0 border-0 py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={SourceCodeIcon} />
                </EmptyMedia>
                <EmptyTitle>Nothing to preview</EmptyTitle>
                <EmptyDescription>
                  Write some HTML, CSS, or JavaScript, then run the pen.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : null}
        {errorCount > 0 && !isEmpty ? (
          <div className="pointer-events-none absolute inset-x-2 top-2 z-10 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-4xl bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
              <HugeiconsIcon icon={Alert02Icon} />
              Runtime error — see console
            </div>
          </div>
        ) : null}
      </div>
    </WorkspacePane>
  )
}
