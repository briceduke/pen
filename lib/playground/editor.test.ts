import { describe, expect, it } from "vitest"

import { editorPaneTitle, editorPlaceholder } from "@/lib/playground/editor"

describe("editor chrome copy", () => {
  it("returns placeholders per language", () => {
    expect(editorPlaceholder("html")).toContain("markup")
    expect(editorPlaceholder("css")).toContain("styles")
    expect(editorPlaceholder("javascript")).toContain("javascript")
  })

  it("returns pane titles", () => {
    expect(editorPaneTitle("html")).toBe("HTML")
    expect(editorPaneTitle("css")).toBe("CSS")
    expect(editorPaneTitle("javascript")).toBe("JS")
  })
})
