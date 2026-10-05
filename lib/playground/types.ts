export type EditorLanguage = "html" | "css" | "javascript"

export type ConsoleLevel = "log" | "info" | "warn" | "error"

export type ConsoleFilter = "all" | "log" | "warn" | "error"

export type PaneTone = EditorLanguage | "preview" | "console"

export type ShareUrlHealth = "ok" | "long" | "tooLong"

export interface PlaygroundDocument {
  readonly v: 1
  readonly html: string
  readonly css: string
  readonly js: string
  readonly autoRun?: boolean
  readonly exampleId?: string
}

export interface StarterExample {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly document: PlaygroundDocument
}

export interface ConsoleMessage {
  readonly id: string
  readonly level: ConsoleLevel
  readonly args: readonly string[]
  readonly timestamp: number
}

export interface PreviewConsoleEvent {
  readonly source: "pen-console"
  readonly level: ConsoleLevel
  readonly args: readonly unknown[]
}

export interface PreviewScrollPosition {
  readonly x: number
  readonly y: number
}

export interface PreviewReadyEvent {
  readonly source: "pen-preview"
  readonly type: "ready"
  readonly token: string
  readonly logs: readonly PreviewReadyLog[]
}

export interface PreviewReadyLog {
  readonly level: ConsoleLevel
  readonly args: readonly unknown[]
}

export interface PreviewScrollEvent extends PreviewScrollPosition {
  readonly source: "pen-preview"
  readonly type: "scroll"
  readonly token: string
}

export interface PreviewRestoreScrollMessage extends PreviewScrollPosition {
  readonly source: "pen-host"
  readonly type: "restore-scroll"
}

export interface ShareLocation {
  readonly search: string
  readonly hash: string
}
