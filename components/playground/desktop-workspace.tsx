"use client"

import { memo } from "react"
import dynamic from "next/dynamic"

import { ConsolePanel } from "@/components/playground/console-panel"
import { PreviewStage } from "@/components/playground/preview-stage"
import { WorkspacePane } from "@/components/playground/workspace-pane"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import { editorPaneTitle } from "@/lib/playground/editor"
import type { ConsoleLevel, ConsoleMessage, EditorLanguage } from "@/lib/playground/types"

const CodeEditor = dynamic(
  () =>
    import("@/components/playground/code-editor").then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  }
)

export interface PlaygroundWorkspaceProps {
  readonly html: string
  readonly css: string
  readonly js: string
  readonly srcdoc: string
  readonly loadId: number
  readonly remountId: number
  readonly messages: readonly ConsoleMessage[]
  readonly isEmpty: boolean
  readonly isStale: boolean
  readonly errorCount: number
  readonly onHtmlChange: (value: string) => void
  readonly onCssChange: (value: string) => void
  readonly onJsChange: (value: string) => void
  readonly onConsoleMessage: (input: {
    readonly level: ConsoleLevel
    readonly args: readonly string[]
  }) => void
  readonly onClearMessages: () => void
}

const EditorColumn = memo(function EditorColumn({
  language,
  value,
  onChangeValue,
}: {
  readonly language: EditorLanguage
  readonly value: string
  readonly onChangeValue: (value: string) => void
}) {
  const title = editorPaneTitle(language)

  return (
    <WorkspacePane title={title} tone={language}>
      <CodeEditor
        language={language}
        value={value}
        onChangeValue={onChangeValue}
        ariaLabel={`${title} editor`}
      />
    </WorkspacePane>
  )
})

export function DesktopWorkspace({
  html,
  css,
  js,
  srcdoc,
  loadId,
  remountId,
  messages,
  isEmpty,
  isStale,
  errorCount,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onConsoleMessage,
  onClearMessages,
}: PlaygroundWorkspaceProps) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full min-h-0"
      id="pen-desktop"
    >
      <ResizablePanel id="editors" defaultSize="50" minSize="22">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          <ResizablePanel id="html" defaultSize="34" minSize="16">
            <EditorColumn
              language="html"
              value={html}
              onChangeValue={onHtmlChange}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="css" defaultSize="33" minSize="16">
            <EditorColumn
              language="css"
              value={css}
              onChangeValue={onCssChange}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="js" defaultSize="33" minSize="16">
            <EditorColumn
              language="javascript"
              value={js}
              onChangeValue={onJsChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="output" defaultSize="50" minSize="22">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          <ResizablePanel id="preview" defaultSize="78" minSize="28">
            <PreviewStage
              srcdoc={srcdoc}
              loadId={loadId}
              remountId={remountId}
              isEmpty={isEmpty}
              isStale={isStale}
              errorCount={errorCount}
              onConsoleMessage={onConsoleMessage}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="console" defaultSize="22" minSize="12">
            <ConsolePanel
              messages={messages}
              onClearMessages={onClearMessages}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
