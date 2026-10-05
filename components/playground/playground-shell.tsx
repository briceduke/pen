"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { DesktopWorkspace } from "@/components/playground/desktop-workspace"
import { MobileWorkspace } from "@/components/playground/mobile-workspace"
import { PlaygroundToolbar } from "@/components/playground/playground-toolbar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DEFAULT_EXAMPLE_ID,
  findStarterExample,
  getDefaultDocument,
} from "@/lib/playground/examples"
import { matchPlaygroundShortcut } from "@/lib/playground/keyboard"
import { buildPreviewSrcdoc } from "@/lib/playground/preview"
import {
  buildShareUrl,
  encodePlaygroundDocument,
  readShareFromLocation,
  replaceShareHash,
} from "@/lib/playground/share"
import { tryCatch } from "@/lib/try-catch"
import type {
  ConsoleLevel,
  ConsoleMessage,
  PlaygroundDocument,
} from "@/lib/playground/types"

const AUTO_RUN_MS = 450
const SHARE_HASH_MS = 700
const DESKTOP_QUERY = "(min-width: 768px)"

function readInitialDocument(): PlaygroundDocument {
  if (typeof window === "undefined") {
    return getDefaultDocument()
  }

  return readShareFromLocation(window.location) ?? getDefaultDocument()
}

function readIsDesktop(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  )
}

function createMessage(
  level: ConsoleLevel,
  args: readonly string[]
): ConsoleMessage {
  return {
    id: crypto.randomUUID(),
    level,
    args,
    timestamp: Date.now(),
  }
}

function toDocument(input: {
  readonly html: string
  readonly css: string
  readonly js: string
  readonly autoRun: boolean
  readonly exampleId: string
}): PlaygroundDocument {
  return {
    v: 1,
    html: input.html,
    css: input.css,
    js: input.js,
    autoRun: input.autoRun,
    exampleId: input.exampleId,
  }
}

export function PlaygroundShell() {
  const [seed] = useState(readInitialDocument)
  const [html, setHtml] = useState(seed.html)
  const [css, setCss] = useState(seed.css)
  const [js, setJs] = useState(seed.js)
  const [autoRun, setAutoRun] = useState(seed.autoRun ?? true)
  const [exampleId, setExampleId] = useState(seed.exampleId ?? DEFAULT_EXAMPLE_ID)
  const [srcdoc, setSrcdoc] = useState(() => buildPreviewSrcdoc(seed))
  const [messages, setMessages] = useState<readonly ConsoleMessage[]>([])
  const [isDesktop, setIsDesktop] = useState(readIsDesktop)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const runTimer = useRef<number | undefined>(undefined)
  const hashTimer = useRef<number | undefined>(undefined)
  const skipFirstAutoRun = useRef(true)

  const applyDocument = useCallback((next: PlaygroundDocument) => {
    setHtml(next.html)
    setCss(next.css)
    setJs(next.js)
    setAutoRun(next.autoRun ?? true)
    setExampleId(next.exampleId ?? DEFAULT_EXAMPLE_ID)
  }, [])

  const runPreview = useCallback((next: PlaygroundDocument) => {
    setMessages([])
    setSrcdoc(buildPreviewSrcdoc(next))
  }, [])

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    function onChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const document = useMemo(
    () => toDocument({ html, css, js, autoRun, exampleId }),
    [html, css, js, autoRun, exampleId]
  )

  useEffect(() => {
    if (!autoRun) {
      skipFirstAutoRun.current = false
      return
    }
    if (skipFirstAutoRun.current) {
      skipFirstAutoRun.current = false
      return
    }
    window.clearTimeout(runTimer.current)
    runTimer.current = window.setTimeout(() => {
      runPreview(document)
    }, AUTO_RUN_MS)
    return () => window.clearTimeout(runTimer.current)
  }, [autoRun, document, runPreview])

  useEffect(() => {
    window.clearTimeout(hashTimer.current)
    hashTimer.current = window.setTimeout(() => {
      replaceShareHash(encodePlaygroundDocument(document))
    }, SHARE_HASH_MS)
    return () => window.clearTimeout(hashTimer.current)
  }, [document])

  const onConsoleMessage = useCallback(
    (input: { readonly level: ConsoleLevel; readonly args: readonly string[] }) => {
      setMessages((current) => [...current, createMessage(input.level, input.args)])
    },
    []
  )

  const onClearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const onShareUrl = useCallback(async () => {
    const encoded = encodePlaygroundDocument(document)
    const url = buildShareUrl(
      window.location.origin,
      window.location.pathname,
      encoded
    )
    replaceShareHash(encoded)
    const result = await tryCatch(async () => {
      await navigator.clipboard.writeText(url)
      return url
    })
    if (result.error) {
      toast.error("Could not copy the share URL")
      return
    }
    toast.success("Share URL copied")
  }, [document])

  const onSelectExample = useCallback(
    (nextExampleId: string) => {
      const example = findStarterExample(nextExampleId)
      applyDocument({ ...example.document, autoRun })
      runPreview({ ...example.document, autoRun })
    },
    [applyDocument, autoRun, runPreview]
  )

  const onConfirmReset = useCallback(() => {
    const example = findStarterExample(exampleId)
    applyDocument({ ...example.document, autoRun })
    runPreview({ ...example.document, autoRun })
    setIsResetOpen(false)
  }, [applyDocument, autoRun, exampleId, runPreview])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const shortcut = matchPlaygroundShortcut(event)
      if (shortcut.run) {
        event.preventDefault()
        runPreview(document)
        return
      }
      if (shortcut.share) {
        event.preventDefault()
        void onShareUrl()
        return
      }
      if (shortcut.reset) {
        event.preventDefault()
        setIsResetOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [document, onShareUrl, runPreview])

  const workspaceProps = {
    html,
    css,
    js,
    srcdoc,
    messages,
    onHtmlChange: setHtml,
    onCssChange: setCss,
    onJsChange: setJs,
    onConsoleMessage,
    onClearMessages,
  }

  return (
    <div className="flex h-svh min-h-0 flex-col bg-background">
      <PlaygroundToolbar
        exampleId={exampleId}
        autoRun={autoRun}
        onSelectExample={onSelectExample}
        onToggleAutoRun={setAutoRun}
        onRunPreview={() => runPreview(document)}
        onShareUrl={() => {
          void onShareUrl()
        }}
        onRequestReset={() => setIsResetOpen(true)}
      />
      <div className="min-h-0 flex-1">
        {isDesktop ? (
          <DesktopWorkspace {...workspaceProps} />
        ) : (
          <MobileWorkspace {...workspaceProps} />
        )}
      </div>
      <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset this pen?</AlertDialogTitle>
            <AlertDialogDescription>
              HTML, CSS, and JS will be restored to the selected starter example.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
