import { describe, expect, it } from "vitest"

import {
  BLANK_PREVIEW_SRCDOC,
  completePreviewLoad,
  createPreviewSlots,
  findPreviewSlot,
  queuePreviewSrcdoc,
} from "@/lib/playground/preview-buffer"

describe("preview double-buffer", () => {
  it("starts with slot 0 visible", () => {
    const slots = createPreviewSlots("<html>one</html>", "t0")

    expect(findPreviewSlot(slots, "active")).toBe(0)
    expect(slots[0]?.srcdoc).toContain("one")
    expect(slots[1]?.srcdoc).toBe(BLANK_PREVIEW_SRCDOC)
  })

  it("loads the next document in the hidden slot", () => {
    const queued = queuePreviewSrcdoc(
      createPreviewSlots("<html>one</html>", "t0"),
      "<html>two</html>",
      "t1"
    )

    expect(findPreviewSlot(queued, "active")).toBe(0)
    expect(findPreviewSlot(queued, "loading")).toBe(1)
    expect(queued[1]?.token).toBe("t1")
  })

  it("replaces an in-flight load instead of touching the visible slot", () => {
    const first = queuePreviewSrcdoc(
      createPreviewSlots("<html>one</html>", "t0"),
      "<html>two</html>",
      "t1"
    )
    const second = queuePreviewSrcdoc(first, "<html>three</html>", "t2")

    expect(findPreviewSlot(second, "active")).toBe(0)
    expect(second[0]?.srcdoc).toContain("one")
    expect(second[1]?.srcdoc).toContain("three")
    expect(second[1]?.token).toBe("t2")
  })

  it("swaps visibility and blanks the outgoing iframe", () => {
    const queued = queuePreviewSrcdoc(
      createPreviewSlots("<html>one</html>", "t0"),
      "<html>two</html>",
      "t1"
    )
    const swapped = completePreviewLoad(queued, 1)

    expect(swapped).not.toBeNull()
    expect(findPreviewSlot(swapped!, "active")).toBe(1)
    expect(swapped?.[1]?.srcdoc).toContain("two")
    expect(swapped?.[0]?.srcdoc).toBe(BLANK_PREVIEW_SRCDOC)
    expect(swapped?.[0]?.role).toBe("idle")
  })

  it("ignores complete on a slot that is not loading", () => {
    const slots = createPreviewSlots("<html>one</html>", "t0")
    expect(completePreviewLoad(slots, 0)).toBeNull()
  })
})
