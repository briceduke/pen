"use client"

import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import type { Extension } from "@codemirror/state"
import CodeMirror from "@uiw/react-codemirror"
import { useTheme } from "next-themes"

import { createEditorTheme } from "@/components/playground/editor-theme"
import type { EditorLanguage } from "@/lib/playground/types"

export interface CodeEditorProps {
  readonly language: EditorLanguage
  readonly value: string
  readonly onChangeValue: (value: string) => void
  readonly ariaLabel: string
}

function getLanguageExtension(language: EditorLanguage): Extension {
  if (language === "html") {
    return html()
  }
  if (language === "css") {
    return css()
  }
  return javascript()
}

export function CodeEditor({
  language,
  value,
  onChangeValue,
  ariaLabel,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"
  const extensions: Extension[] = [
    getLanguageExtension(language),
    createEditorTheme(isDark),
  ]

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="none"
      extensions={extensions}
      onChange={onChangeValue}
      basicSetup={{
        foldGutter: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: false,
      }}
      aria-label={ariaLabel}
      className="h-full overflow-hidden"
    />
  )
}
