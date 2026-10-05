"use client"

import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import type { Extension } from "@codemirror/state"
import { EditorView, placeholder } from "@codemirror/view"
import CodeMirror from "@uiw/react-codemirror"
import { useTheme } from "next-themes"
import { useMemo } from "react"

import { createEditorTheme } from "@/components/playground/editor-theme"
import { editorPlaceholder } from "@/lib/playground/editor"
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

  const extensions = useMemo((): Extension[] => {
    return [
      getLanguageExtension(language),
      EditorView.lineWrapping,
      placeholder(editorPlaceholder(language)),
      createEditorTheme(isDark),
    ]
  }, [isDark, language])

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
        highlightActiveLineGutter: true,
      }}
      aria-label={ariaLabel}
      className="h-full overflow-hidden"
    />
  )
}
