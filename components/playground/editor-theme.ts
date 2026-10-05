import { EditorView } from "@codemirror/view"
import type { Extension } from "@codemirror/state"

/**
 * CodeMirror theme that follows Maia/shadcn semantic tokens.
 *
 * @param isDark - Whether the resolved app theme is dark
 * @returns CodeMirror theme extension
 */
export function createEditorTheme(isDark: boolean): Extension {
  return EditorView.theme(
    {
      "&": {
        height: "100%",
        backgroundColor: "transparent",
        color: "var(--foreground)",
        fontSize: "13px",
      },
      "&.cm-focused": {
        outline: "none",
      },
      ".cm-scroller": {
        overflow: "auto",
        overscrollBehavior: "contain",
        fontFamily: "var(--font-mono), ui-monospace, monospace",
      },
      ".cm-content": {
        caretColor: "var(--foreground)",
        padding: "8px 0",
      },
      ".cm-line": {
        padding: "0 12px 0 4px",
      },
      ".cm-gutters": {
        backgroundColor: "color-mix(in oklch, var(--muted) 42%, transparent)",
        color: "var(--muted-foreground)",
        border: "none",
        borderRight: "1px solid var(--border)",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        minWidth: "2.4rem",
        padding: "0 10px 0 8px",
      },
      ".cm-activeLine": {
        backgroundColor: "color-mix(in oklch, var(--muted) 55%, transparent)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "color-mix(in oklch, var(--muted) 70%, transparent)",
        color: "var(--foreground)",
      },
      ".cm-cursor": {
        borderLeftColor: "var(--foreground)",
      },
      ".cm-placeholder": {
        color: "var(--muted-foreground)",
        fontStyle: "italic",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor: "color-mix(in oklch, var(--primary) 28%, transparent)",
      },
    },
    { dark: isDark }
  )
}
