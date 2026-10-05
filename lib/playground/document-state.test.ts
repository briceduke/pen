import { describe, expect, it } from "vitest"

import {
  isPlaygroundStale,
  isPreviewSourceEmpty,
} from "@/lib/playground/document-state"

const base = {
  v: 1 as const,
  html: "<p>hi</p>",
  css: "body{}",
  js: "console.log(1)",
}

describe("playground document state", () => {
  it("detects stale editors", () => {
    expect(isPlaygroundStale(base, base)).toBe(false)
    expect(isPlaygroundStale({ ...base, js: "console.log(2)" }, base)).toBe(true)
  })

  it("treats whitespace-only sources as empty", () => {
    expect(isPreviewSourceEmpty({ ...base, html: "", css: "", js: "" })).toBe(
      true
    )
    expect(
      isPreviewSourceEmpty({ ...base, html: "  ", css: "\n", js: "\t" })
    ).toBe(true)
    expect(isPreviewSourceEmpty(base)).toBe(false)
  })
})
