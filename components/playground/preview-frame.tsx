"use client"

import { useEffect, useRef } from "react"

import {
  isPreviewConsoleEvent,
  stringifyConsoleArgs,
} from "@/lib/playground/preview"
import type { ConsoleLevel } from "@/lib/playground/types"

export interface PreviewFrameProps {
  readonly srcdoc: string
  readonly runId: number
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
}

export function PreviewFrame({
  srcdoc,
  runId,
  onConsoleMessage,
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function onMessage(event: MessageEvent<unknown>) {
      if (event.source !== frameRef.current?.contentWindow) {
        return
      }
      if (!isPreviewConsoleEvent(event.data)) {
        return
      }

      onConsoleMessage({
        level: event.data.level,
        args: stringifyConsoleArgs(event.data.args),
      })
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [onConsoleMessage])

  return (
    <iframe
      key={runId}
      ref={frameRef}
      title="Live preview"
      sandbox="allow-scripts"
      srcDoc={srcdoc}
      className="h-full w-full bg-background"
    />
  )
}
