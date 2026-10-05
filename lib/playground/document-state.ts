import type { PlaygroundDocument } from "@/lib/playground/types"

/**
 * @param current - Live editor document
 * @param lastRun - Document last sent to the preview iframe
 * @returns Whether HTML, CSS, or JS has changed since the last run
 */
export function isPlaygroundStale(
  current: PlaygroundDocument,
  lastRun: Pick<PlaygroundDocument, "html" | "css" | "js">
): boolean {
  return (
    current.html !== lastRun.html ||
    current.css !== lastRun.css ||
    current.js !== lastRun.js
  )
}

/**
 * @param document - Live editor document
 * @returns Whether the preview has no markup, styles, or script
 */
export function isPreviewSourceEmpty(document: PlaygroundDocument): boolean {
  return (
    document.html.trim().length === 0 &&
    document.css.trim().length === 0 &&
    document.js.trim().length === 0
  )
}
