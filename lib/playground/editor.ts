import type { EditorLanguage } from "@/lib/playground/types"

/**
 * @param language - Editor language
 * @returns Placeholder shown when the buffer is empty
 */
export function editorPlaceholder(language: EditorLanguage): string {
  if (language === "html") {
    return "<!-- markup -->"
  }
  if (language === "css") {
    return "/* styles */"
  }
  return "// javascript"
}

/**
 * @param language - Editor language
 * @returns Short pane title
 */
export function editorPaneTitle(language: EditorLanguage): string {
  if (language === "html") {
    return "HTML"
  }
  if (language === "css") {
    return "CSS"
  }
  return "JS"
}
