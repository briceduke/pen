"use client"

import { useEffect, useRef, useState } from "react"

import {
  BLANK_PREVIEW_SRCDOC,
  completePreviewLoad,
  createPreviewSlots,
  findPreviewSlot,
  queuePreviewSrcdoc,
  type PreviewSlotIndex,
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
  readonly remountId: number
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
}

function PreviewBuffer({
  srcdoc,
  onConsoleMessage,
}: Omit<PreviewFrameProps, "remountId">) {
  const [slots, setSlots] = useState(() =>
    createPreviewSlots(BLANK_PREVIEW_SRCDOC, "")
  )
  const slotsRef = useRef(slots)
  const framesRef = useRef<[HTMLIFrameElement | null, HTMLIFrameElement | null]>(
    [null, null]
  )
  const scrollRef = useRef<PreviewScrollPosition>({ x: 0, y: 0 })

  useEffect(() => {
    slotsRef.current = slots
  }, [slots])

  useEffect(() => {
    function acceptedToken(): string | null {
      const current = slotsRef.current
      const loading = findPreviewSlot(current, "loading")
      if (loading !== null) {
        return current[loading].token
      }
      const active = findPreviewSlot(current, "active")
      return active === null ? null : current[active].token
    }

    function onMessage(event: MessageEvent<unknown>) {
      const current = slotsRef.current
      const token = acceptedToken()

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
          onConsoleMessage({
            level: log.level,
            args: stringifyConsoleArgs(log.args),
          })
        }

        const frame = framesRef.current[loading]
        frame?.contentWindow?.postMessage(
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

      onConsoleMessage({
        level: event.data.level,
        args: stringifyConsoleArgs(event.data.args),
      })
    }

    window.addEventListener("message", onMessage)
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

    return () => window.removeEventListener("message", onMessage)
  }, [onConsoleMessage, srcdoc])

  const active = findPreviewSlot(slots, "active") ?? 0

  return (
    <div className="relative h-full min-h-0 bg-background">
      {([0, 1] as const).map((index: PreviewSlotIndex) => {
        const isActive = index === active
        return (
          <iframe
            key={index}
            ref={(node) => {
              framesRef.current[index] = node
            }}
            title={isActive ? "Live preview" : "Live preview (loading)"}
            sandbox="allow-scripts"
            srcDoc={slots[index].srcdoc}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 h-full w-full bg-background",
              isActive ? "visible" : "invisible"
            )}
          />
        )
      })}
    </div>
  )
}

export function PreviewFrame({
  srcdoc,
  remountId,
  onConsoleMessage,
}: PreviewFrameProps) {
  return (
    <PreviewBuffer
      key={remountId}
      srcdoc={srcdoc}
      onConsoleMessage={onConsoleMessage}
    />
  )
}
