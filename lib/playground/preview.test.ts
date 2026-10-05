import { describe, expect, it } from "vitest"

import { getDefaultDocument } from "@/lib/playground/examples"
import {
  buildPreviewSrcdoc,
  isPreviewConsoleEvent,
  stringifyConsoleArgs,
} from "@/lib/playground/preview"

describe("preview srcdoc", () => {
  it("includes css, html, js, and the console bridge", () => {
    const srcdoc = buildPreviewSrcdoc(getDefaultDocument())

    expect(srcdoc).toContain("<style>")
    expect(srcdoc).toContain('id="ping"')
    expect(srcdoc).toContain("pen-console")
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
