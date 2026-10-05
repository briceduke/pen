import { describe, expect, it } from "vitest"

import { getDefaultDocument } from "@/lib/playground/examples"
import {
  applyPreviewRuntimeToken,
  buildPreviewSrcdoc,
  buildRestoreScrollMessage,
  isPreviewConsoleEvent,
  isPreviewReadyEvent,
  isPreviewScrollEvent,
  PREVIEW_RUNTIME_TOKEN_PLACEHOLDER,
  stringifyConsoleArgs,
} from "@/lib/playground/preview"

describe("preview srcdoc", () => {
  it("includes css, html, js, and the console bridge", () => {
    const srcdoc = buildPreviewSrcdoc(getDefaultDocument())

    expect(srcdoc).toContain("<style>")
    expect(srcdoc).toContain('id="ping"')
    expect(srcdoc).toContain("pen-console")
    expect(srcdoc).toContain("pen-preview")
    expect(srcdoc).toContain(PREVIEW_RUNTIME_TOKEN_PLACEHOLDER)
    expect(srcdoc).toContain("Preview ready")
  })

  it("escapes closing script tags in user javascript", () => {
    const srcdoc = buildPreviewSrcdoc({
      v: 1,
      html: "",
      css: "",
      js: 'const x = "</script>"',
    })

    expect(srcdoc).not.toContain("</script>\"")
    expect(srcdoc).toContain("<\\/script>")
  })
})

describe("console events", () => {
  it("accepts valid iframe messages", () => {
    expect(
      isPreviewConsoleEvent({
        source: "pen-console",
        level: "log",
        args: ["hi"],
      })
    ).toBe(true)
  })

  it("rejects unrelated messages", () => {
    expect(isPreviewConsoleEvent({ hello: true })).toBe(false)
  })

  it("stringifies console arguments", () => {
    expect(stringifyConsoleArgs(["ok", { a: 1 }])).toEqual(["ok", '{"a":1}'])
  })
})

describe("preview runtime handshake", () => {
  it("tags srcdoc with a per-load token", () => {
    const srcdoc = buildPreviewSrcdoc(getDefaultDocument())
    const tagged = applyPreviewRuntimeToken(srcdoc, "token-1")
    expect(tagged).toContain("token-1")
    expect(tagged).not.toContain(PREVIEW_RUNTIME_TOKEN_PLACEHOLDER)
  })

  it("accepts ready and scroll events", () => {
    expect(
      isPreviewReadyEvent({
        source: "pen-preview",
        type: "ready",
        token: "t1",
      })
    ).toBe(true)
    expect(
      isPreviewScrollEvent({
        source: "pen-preview",
        type: "scroll",
        token: "t1",
        x: 0,
        y: 40,
      })
    ).toBe(true)
    expect(isPreviewReadyEvent({ source: "pen-console" })).toBe(false)
  })

  it("builds a host restore-scroll message", () => {
    expect(buildRestoreScrollMessage({ x: 2, y: 8 })).toEqual({
      source: "pen-host",
      type: "restore-scroll",
      x: 2,
      y: 8,
    })
  })
})
