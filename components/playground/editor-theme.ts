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
      ".cm-scroller": {
        overflow: "auto",
        fontFamily: "var(--font-mono), ui-monospace, monospace",
      },
      ".cm-content": {
        caretColor: "var(--foreground)",
        padding: "8px 0",
      },
      ".cm-gutters": {
        backgroundColor: "transparent",
        color: "var(--muted-foreground)",
        border: "none",
      },
      ".cm-activeLine": {
        backgroundColor:
          "color-mix(in oklch, var(--muted) 55%, transparent)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
      },
      ".cm-cursor": {
        borderLeftColor: "var(--foreground)",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor:
          "color-mix(in oklch, var(--primary) 28%, transparent)",
      },
    },
    { dark: isDark }
  )
}
