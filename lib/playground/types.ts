export type EditorLanguage = "html" | "css" | "javascript"

export type ConsoleLevel = "log" | "info" | "warn" | "error"

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

export interface ShareLocation {
  readonly search: string
  readonly hash: string
}
