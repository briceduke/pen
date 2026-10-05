"use client"

import dynamic from "next/dynamic"

import { ConsolePanel } from "@/components/playground/console-panel"
import { PaneHeader } from "@/components/playground/pane-header"
import { PreviewFrame } from "@/components/playground/preview-frame"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import type { ConsoleLevel, ConsoleMessage } from "@/lib/playground/types"

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

export function DesktopWorkspace({
  html,
  css,
  js,
  srcdoc,
  messages,
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
            <div className="flex h-full min-h-0 flex-col">
              <PaneHeader title="HTML" />
              <div className="min-h-0 flex-1">
                <CodeEditor
                  language="html"
                  value={html}
                  onChangeValue={onHtmlChange}
                  ariaLabel="HTML editor"
                />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="css" defaultSize="33" minSize="16">
            <div className="flex h-full min-h-0 flex-col">
              <PaneHeader title="CSS" />
              <div className="min-h-0 flex-1">
                <CodeEditor
                  language="css"
                  value={css}
                  onChangeValue={onCssChange}
                  ariaLabel="CSS editor"
                />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="js" defaultSize="33" minSize="16">
            <div className="flex h-full min-h-0 flex-col">
              <PaneHeader title="JS" />
              <div className="min-h-0 flex-1">
                <CodeEditor
                  language="javascript"
                  value={js}
                  onChangeValue={onJsChange}
                  ariaLabel="JavaScript editor"
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="output" defaultSize="50" minSize="22">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          <ResizablePanel id="preview" defaultSize="68" minSize="24">
            <div className="flex h-full min-h-0 flex-col">
              <PaneHeader title="Preview" />
              <div className="min-h-0 flex-1">
                <PreviewFrame srcdoc={srcdoc} onConsoleMessage={onConsoleMessage} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="console" defaultSize="32" minSize="14">
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
