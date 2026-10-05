"use client"

import { useLayoutEffect, useRef, useState } from "react"

import {
  completePreviewLoad,
  createIdlePreviewSlots,
  findPreviewSlot,
  previewSlotKey,
  queuePreviewSrcdoc,
  visiblePreviewSlot,
  type PreviewSlotIndex,
  type PreviewSlots,
} from "@/lib/playground/preview-buffer"
import {
  applyPreviewRuntimeToken,
  buildRestoreScrollMessage,
  isPreviewConsoleEvent,
  isPreviewReadyEvent,
  isPreviewReadyLog,
  isPreviewScrollEvent,
  stringifyConsoleArgs,
} from "@/lib/playground/preview"
import type { ConsoleLevel, PreviewScrollPosition } from "@/lib/playground/types"
import { cn } from "@/lib/utils"

export interface PreviewFrameProps {
  readonly srcdoc: string
  readonly loadId: number
  readonly remountId: number
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
}

interface PreviewConsolePayload {
  readonly level: ConsoleLevel
  readonly args: readonly string[]
}

/**
 * @param slots - Current double-buffer slots
 * @returns Token whose iframe may emit console, ready, or scroll events
 */
function readAcceptedToken(slots: PreviewSlots): string | null {
  const loading = findPreviewSlot(slots, "loading")
  if (loading !== null) {
    return slots[loading].token
  }
  const active = findPreviewSlot(slots, "active")
  return active === null ? null : slots[active].token
}

function PreviewBuffer({
  srcdoc,
  loadId,
  onConsoleMessage,
}: Omit<PreviewFrameProps, "remountId">) {
  const [slots, setSlots] = useState(createIdlePreviewSlots)
  const slotsRef = useRef(slots)
  const framesRef = useRef<[HTMLIFrameElement | null, HTMLIFrameElement | null]>(
    [null, null]
  )
  const scrollRef = useRef<PreviewScrollPosition>({ x: 0, y: 0 })
  const onConsoleMessageRef = useRef(onConsoleMessage)

  onConsoleMessageRef.current = onConsoleMessage
  slotsRef.current = slots

  useLayoutEffect(() => {
    function publishConsole(input: PreviewConsolePayload): void {
      onConsoleMessageRef.current(input)
    }

    function onMessage(event: MessageEvent<unknown>): void {
      const current = slotsRef.current
      const token = readAcceptedToken(current)

      if (isPreviewScrollEvent(event.data)) {
        if (event.data.token === token) {
          scrollRef.current = { x: event.data.x, y: event.data.y }
        }
        return
      }

      if (isPreviewReadyEvent(event.data)) {
        const loading = findPreviewSlot(current, "loading")
        if (loading === null) {
          return
        }
        if (event.data.token !== current[loading].token) {
          return
        }

        for (const log of event.data.logs) {
          if (!isPreviewReadyLog(log)) {
            continue
          }
          publishConsole({
            level: log.level,
            args: stringifyConsoleArgs(log.args),
          })
        }

        framesRef.current[loading]?.contentWindow?.postMessage(
          buildRestoreScrollMessage(scrollRef.current),
          "*"
        )
        setSlots((incoming) => {
          const next = completePreviewLoad(incoming, loading) ?? incoming
          slotsRef.current = next
          return next
        })
        return
      }

      if (!isPreviewConsoleEvent(event.data)) {
        return
      }
      if (findPreviewSlot(current, "loading") !== null) {
        return
      }
      if (event.data.token !== token) {
        return
      }

      publishConsole({
        level: event.data.level,
        args: stringifyConsoleArgs(event.data.args),
      })
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  useLayoutEffect(() => {
    const loadToken = crypto.randomUUID()
    setSlots((current) => {
      const next = queuePreviewSrcdoc(
        current,
        applyPreviewRuntimeToken(srcdoc, loadToken),
        loadToken
      )
      slotsRef.current = next
      return next
    })
  }, [loadId, srcdoc])

  const visible = visiblePreviewSlot(slots)

  return (
    <div className="relative h-full min-h-0 bg-background">
      {([0, 1] as const).map((index: PreviewSlotIndex) => {
        const isVisible = index === visible
        return (
          <iframe
            key={previewSlotKey(index, slots[index])}
            ref={(node) => {
              framesRef.current[index] = node
            }}
            title={isVisible ? "Live preview" : "Live preview (loading)"}
            sandbox="allow-scripts"
            srcDoc={slots[index].srcdoc}
            aria-hidden={!isVisible}
            className={cn(
              "absolute inset-0 h-full w-full bg-background",
              isVisible ? "z-10" : "z-0 opacity-0 pointer-events-none"
            )}
          />
        )
      })}
    </div>
  )
}

export function PreviewFrame({
  srcdoc,
  loadId,
  remountId,
  onConsoleMessage,
}: PreviewFrameProps) {
  return (
    <PreviewBuffer
      key={remountId}
      srcdoc={srcdoc}
      loadId={loadId}
      onConsoleMessage={onConsoleMessage}
    />
  )
}
