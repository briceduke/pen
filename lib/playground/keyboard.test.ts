import { describe, expect, it } from "vitest"

import {
  matchPlaygroundShortcut,
  modifierKeyLabel,
} from "@/lib/playground/keyboard"

function keyEvent(partial: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    key: "Enter",
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...partial,
  } as KeyboardEvent
}

describe("keyboard shortcuts", () => {
  it("matches mod+enter as run", () => {
    expect(matchPlaygroundShortcut(keyEvent({ metaKey: true, key: "Enter" })).run).toBe(
      true
    )
  })

  it("matches mod+s as share", () => {
    expect(matchPlaygroundShortcut(keyEvent({ ctrlKey: true, key: "s" })).share).toBe(
      true
    )
  })

  it("matches mod+shift+r as reset", () => {
    expect(
      matchPlaygroundShortcut(
        keyEvent({ metaKey: true, shiftKey: true, key: "r" })
      ).reset
    ).toBe(true)
  })

  it("uses platform-aware modifier labels", () => {
    expect(modifierKeyLabel("Mozilla/5.0 (Macintosh)")).toBe("⌘")
    expect(modifierKeyLabel("Mozilla/5.0 (X11; Linux x86_64)")).toBe("Ctrl")
  })
})
