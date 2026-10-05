import { describe, expect, it } from "vitest"

import { getDefaultDocument } from "@/lib/playground/examples"
import {
  buildShareUrl,
  classifyShareUrlLength,
  decodePlaygroundDocument,
  encodePlaygroundDocument,
  formatShareCopiedMessage,
  readShareFromLocation,
  SHARE_URL_HARD_LIMIT,
  SHARE_URL_SOFT_LIMIT,
} from "@/lib/playground/share"

describe("playground share encoding", () => {
  it("round-trips a document through lz compression", () => {
    const document = getDefaultDocument()
    const encoded = encodePlaygroundDocument(document)
    const decoded = decodePlaygroundDocument(encoded)

    expect(decoded).toEqual({
      v: 1,
      html: document.html,
      css: document.css,
      js: document.js,
      autoRun: document.autoRun,
      exampleId: document.exampleId,
    })
  })

  it("rejects garbage payloads", () => {
    expect(decodePlaygroundDocument("not-valid")).toBeNull()
  })

  it("reads hash payloads over query payloads", () => {
    const document = {
      v: 1 as const,
      html: "<p>hash</p>",
      css: "body{}",
      js: "console.log(1)",
    }
    const other = {
      v: 1 as const,
      html: "<p>query</p>",
      css: "",
      js: "",
    }

    const decoded = readShareFromLocation({
      hash: `#d=${encodePlaygroundDocument(document)}`,
      search: `?d=${encodePlaygroundDocument(other)}`,
    })

    expect(decoded?.html).toBe("<p>hash</p>")
  })

  it("builds a hash share URL", () => {
    const url = buildShareUrl("https://pen.example", "/", "abc")
    expect(url).toBe("https://pen.example/#d=abc")
  })

  it("classifies share URL length without changing encoding", () => {
    expect(classifyShareUrlLength(120)).toBe("ok")
    expect(classifyShareUrlLength(SHARE_URL_SOFT_LIMIT + 1)).toBe("long")
    expect(classifyShareUrlLength(SHARE_URL_HARD_LIMIT + 1)).toBe("tooLong")
    expect(formatShareCopiedMessage(120)).toBe("Share URL copied")
    expect(formatShareCopiedMessage(SHARE_URL_HARD_LIMIT + 1)).toContain("may fail")
  })
})
