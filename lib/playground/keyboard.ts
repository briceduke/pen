export interface ShortcutMatch {
  readonly run: boolean
  readonly share: boolean
  readonly reset: boolean
}

function hasMod(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey
}

/**
 * Maps a keydown event to playground shortcuts.
 *
 * @param event - Window or editor keydown event
 * @returns Which shortcut fired
 */
export function matchPlaygroundShortcut(event: KeyboardEvent): ShortcutMatch {
  const mod = hasMod(event)
  const key = event.key.toLowerCase()

  return {
    run: mod && key === "enter" && !event.shiftKey && !event.altKey,
    share: mod && key === "s" && !event.shiftKey && !event.altKey,
    reset: mod && event.shiftKey && key === "r" && !event.altKey,
  }
}
