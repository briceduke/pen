"use client"

import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import type { Extension } from "@codemirror/state"
import { EditorView, placeholder } from "@codemirror/view"
import CodeMirror from "@uiw/react-codemirror"
import { useTheme } from "next-themes"
import { memo, useMemo } from "react"

import { createEditorTheme } from "@/components/playground/editor-theme"
import { editorPlaceholder } from "@/lib/playground/editor"
import type { EditorLanguage } from "@/lib/playground/types"

export interface CodeEditorProps {
  readonly language: EditorLanguage
  readonly value: string
  readonly onChangeValue: (value: string) => void
  readonly ariaLabel: string
}

const LANGUAGE_EXTENSIONS: Record<EditorLanguage, Extension> = {
  html: html(),
  css: css(),
  javascript: javascript(),
}

const LINE_WRAPPING: Extension = EditorView.lineWrapping

const EDITOR_BASIC_SETUP = {
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  autocompletion: false,
} as const

const EDITOR_THEMES: Record<"dark" | "light", Extension> = {
  dark: createEditorTheme(true),
  light: createEditorTheme(false),
}

export const CodeEditor = memo(function CodeEditor({
  language,
  value,
  onChangeValue,
  ariaLabel,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  const extensions = useMemo((): Extension[] => {
    return [
      LANGUAGE_EXTENSIONS[language],
      LINE_WRAPPING,
      placeholder(editorPlaceholder(language)),
      EDITOR_THEMES[isDark ? "dark" : "light"],
    ]
  }, [isDark, language])

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="none"
      extensions={extensions}
      onChange={onChangeValue}
      basicSetup={EDITOR_BASIC_SETUP}
      aria-label={ariaLabel}
      className="h-full overflow-hidden"
    />
  )
})
