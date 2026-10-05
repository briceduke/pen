import { describe, expect, it } from "vitest"

import {
  BLANK_PREVIEW_SRCDOC,
  completePreviewLoad,
  createIdlePreviewSlots,
  createPreviewSlots,
  findPreviewSlot,
  isBlankPreviewSrcdoc,
  previewSlotKey,
  queuePreviewSrcdoc,
  visiblePreviewSlot,
} from "@/lib/playground/preview-buffer"

const STARTER = "<html>starter</html>"
const EDITED = "<html>edited</html>"

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

describe("preview cold start and revert", () => {
  it("treats the placeholder document as blank", () => {
    expect(isBlankPreviewSrcdoc(BLANK_PREVIEW_SRCDOC)).toBe(true)
    expect(isBlankPreviewSrcdoc(STARTER)).toBe(false)
  })

  it("paints the first real document instead of a blank active slot", () => {
    const queued = queuePreviewSrcdoc(createIdlePreviewSlots(), STARTER, "t0")

    expect(findPreviewSlot(queued, "active")).toBeNull()
    expect(findPreviewSlot(queued, "loading")).toBe(0)
    expect(queued[0]?.srcdoc).toBe(STARTER)
    expect(visiblePreviewSlot(queued)).toBe(0)
  })

  it("does not keep showing a blank active iframe while starter is loading", () => {
    const queued = queuePreviewSrcdoc(
      createPreviewSlots(BLANK_PREVIEW_SRCDOC, ""),
      STARTER,
      "t0"
    )

    expect(findPreviewSlot(queued, "loading")).toBe(0)
    expect(visiblePreviewSlot(queued)).toBe(0)
    expect(queued[0]?.srcdoc).toBe(STARTER)
  })

  it("remounts a slot when its load token changes", () => {
    const idle = createIdlePreviewSlots()[0]
    const loading = { srcdoc: STARTER, role: "loading" as const, token: "t0" }

    expect(previewSlotKey(0, idle)).toBe("preview-0-idle")
    expect(previewSlotKey(0, loading)).toBe("preview-0-t0")
    expect(previewSlotKey(0, { ...loading, token: "t1" })).toBe("preview-0-t1")
  })

  it("reloads the original template after an edit without blanking the painted iframe", () => {
    const started = queuePreviewSrcdoc(createIdlePreviewSlots(), STARTER, "t0")
    const firstPaint = completePreviewLoad(started, 0)
    expect(firstPaint).not.toBeNull()
    expect(visiblePreviewSlot(firstPaint!)).toBe(0)
    expect(firstPaint?.[0]?.srcdoc).toBe(STARTER)

    const edited = queuePreviewSrcdoc(firstPaint!, EDITED, "t1")
    expect(visiblePreviewSlot(edited)).toBe(0)
    expect(edited[0]?.srcdoc).toBe(STARTER)
    expect(edited[1]?.srcdoc).toBe(EDITED)

    const editedPaint = completePreviewLoad(edited, 1)
    expect(editedPaint).not.toBeNull()
    expect(visiblePreviewSlot(editedPaint!)).toBe(1)
    expect(editedPaint?.[1]?.srcdoc).toBe(EDITED)

    const reverted = queuePreviewSrcdoc(editedPaint!, STARTER, "t2")
    expect(visiblePreviewSlot(reverted)).toBe(1)
    expect(reverted[1]?.srcdoc).toBe(EDITED)
    expect(reverted[0]?.srcdoc).toBe(STARTER)
    expect(reverted[0]?.token).toBe("t2")
    expect(previewSlotKey(0, reverted[0]!)).not.toBe(
      previewSlotKey(0, editedPaint![0]!)
    )

    const revertedPaint = completePreviewLoad(reverted, 0)
    expect(revertedPaint).not.toBeNull()
    expect(visiblePreviewSlot(revertedPaint!)).toBe(0)
    expect(revertedPaint?.[0]?.srcdoc).toBe(STARTER)
    expect(isBlankPreviewSrcdoc(revertedPaint?.[1]?.srcdoc ?? "")).toBe(true)
  })

  it("still queues a new token when srcdoc matches the painted document", () => {
    const painted = completePreviewLoad(
      queuePreviewSrcdoc(createIdlePreviewSlots(), STARTER, "t0"),
      0
    )
    expect(painted).not.toBeNull()

    const requeued = queuePreviewSrcdoc(painted!, STARTER, "t-again")
    expect(findPreviewSlot(requeued, "loading")).toBe(1)
    expect(requeued[1]?.token).toBe("t-again")
    expect(requeued[1]?.srcdoc).toBe(STARTER)
    expect(visiblePreviewSlot(requeued)).toBe(0)
  })
})
