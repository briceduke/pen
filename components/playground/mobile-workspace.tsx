"use client"

import dynamic from "next/dynamic"

import { ConsolePanel } from "@/components/playground/console-panel"
import { PreviewFrame } from "@/components/playground/preview-frame"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConsoleLevel, ConsoleMessage } from "@/lib/playground/types"

const CodeEditor = dynamic(
  () =>
    import("@/components/playground/code-editor").then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  }
)

export interface MobileWorkspaceProps {
  readonly html: string
  readonly css: string
  readonly js: string
  readonly srcdoc: string
  readonly runId: number
  readonly messages: readonly ConsoleMessage[]
  readonly onHtmlChange: (value: string) => void
  readonly onCssChange: (value: string) => void
  readonly onJsChange: (value: string) => void
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
  readonly onClearMessages: () => void
}

export function MobileWorkspace({
  html,
  css,
  js,
  srcdoc,
  runId,
  messages,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onConsoleMessage,
  onClearMessages,
}: MobileWorkspaceProps) {
  return (
    <Tabs defaultValue="html" className="h-full min-h-0 gap-0">
      <div className="overflow-x-auto border-b px-2 py-2">
        <TabsList className="w-max">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="js">JS</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="html" className="min-h-0 overflow-hidden">
        <CodeEditor
          language="html"
          value={html}
          onChangeValue={onHtmlChange}
          ariaLabel="HTML editor"
        />
      </TabsContent>
      <TabsContent value="css" className="min-h-0 overflow-hidden">
        <CodeEditor
          language="css"
          value={css}
          onChangeValue={onCssChange}
          ariaLabel="CSS editor"
        />
      </TabsContent>
      <TabsContent value="js" className="min-h-0 overflow-hidden">
        <CodeEditor
          language="javascript"
          value={js}
          onChangeValue={onJsChange}
          ariaLabel="JavaScript editor"
        />
      </TabsContent>
      <TabsContent value="preview" className="min-h-0 overflow-hidden">
        <PreviewFrame
          srcdoc={srcdoc}
          runId={runId}
          onConsoleMessage={onConsoleMessage}
        />
      </TabsContent>
      <TabsContent value="console" className="min-h-0 overflow-hidden">
        <ConsolePanel messages={messages} onClearMessages={onClearMessages} />
      </TabsContent>
    </Tabs>
  )
}
