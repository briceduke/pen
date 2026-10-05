"use client"

import { useEffect, useRef, useState } from "react"

import {
  completePreviewLoad,
  createPreviewSlots,
  findPreviewSlot,
  queuePreviewSrcdoc,
  type PreviewSlotIndex,
  type PreviewSlots,
} from "@/lib/playground/preview-buffer"
import {
  applyPreviewRuntimeToken,
  buildRestoreScrollMessage,
  isPreviewConsoleEvent,
  isPreviewReadyEvent,
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

function createTaggedSlots(srcdoc: string): PreviewSlots {
  const token = crypto.randomUUID()
  return createPreviewSlots(applyPreviewRuntimeToken(srcdoc, token), token)
}

function PreviewBuffer({
  srcdoc,
  onConsoleMessage,
}: Omit<PreviewFrameProps, "remountId">) {
  const [slots, setSlots] = useState(() => createTaggedSlots(srcdoc))
  const slotsRef = useRef(slots)
  const framesRef = useRef<[HTMLIFrameElement | null, HTMLIFrameElement | null]>(
    [null, null]
  )
  const scrollRef = useRef<PreviewScrollPosition>({ x: 0, y: 0 })
  const skipFirstSrcdoc = useRef(true)

  useEffect(() => {
    slotsRef.current = slots
  }, [slots])

  useEffect(() => {
    if (skipFirstSrcdoc.current) {
      skipFirstSrcdoc.current = false
      return
    }

    const token = crypto.randomUUID()
    setSlots((current) =>
      queuePreviewSrcdoc(
        current,
        applyPreviewRuntimeToken(srcdoc, token),
        token
      )
    )
  }, [srcdoc])

  useEffect(() => {
    function onMessage(event: MessageEvent<unknown>) {
      const current = slotsRef.current
      const sourceWindow = event.source
      const frameWindows: readonly (Window | null | undefined)[] = [
        framesRef.current[0]?.contentWindow,
        framesRef.current[1]?.contentWindow,
      ]

      if (isPreviewScrollEvent(event.data)) {
        const active = findPreviewSlot(current, "active")
        if (active !== null && sourceWindow === frameWindows[active]) {
          scrollRef.current = { x: event.data.x, y: event.data.y }
        }
        return
      }

      if (isPreviewReadyEvent(event.data)) {
        const loading = findPreviewSlot(current, "loading")
        if (loading === null) {
          return
        }
        if (sourceWindow !== frameWindows[loading]) {
          return
        }
        if (event.data.token !== current[loading].token) {
          return
        }

        const frame = framesRef.current[loading]
        frame?.contentWindow?.postMessage(
          buildRestoreScrollMessage(scrollRef.current),
          "*"
        )
        setSlots((incoming) => completePreviewLoad(incoming, loading) ?? incoming)
        return
      }

      if (!isPreviewConsoleEvent(event.data)) {
        return
      }

      const loading = findPreviewSlot(current, "loading")
      const accepted =
        loading !== null ? frameWindows[loading] : frameWindows[findPreviewSlot(current, "active") ?? 0]
      if (sourceWindow !== accepted) {
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
