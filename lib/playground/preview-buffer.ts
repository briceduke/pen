export const BLANK_PREVIEW_SRCDOC =
  "<!DOCTYPE html><html><head><meta charset=\"utf-8\" /></head><body></body></html>"

export type PreviewSlotIndex = 0 | 1

export type PreviewSlotRole = "active" | "loading" | "idle"

export interface PreviewSlot {
  readonly srcdoc: string
  readonly role: PreviewSlotRole
  readonly token: string
}

export type PreviewSlots = readonly [PreviewSlot, PreviewSlot]

const IDLE_SLOT: PreviewSlot = {
  srcdoc: BLANK_PREVIEW_SRCDOC,
  role: "idle",
  token: "",
}

/**
 * @param srcdoc - HTML document to inspect
 * @returns Whether the document is the empty double-buffer placeholder
 */
export function isBlankPreviewSrcdoc(srcdoc: string): boolean {
  return srcdoc === BLANK_PREVIEW_SRCDOC
}

/**
 * @returns Double-buffer slots with no visible document yet
 */
export function createIdlePreviewSlots(): PreviewSlots {
  return [IDLE_SLOT, IDLE_SLOT]
}

/**
 * @param srcdoc - Initial tagged srcdoc for the visible iframe
 * @param token - Runtime token baked into that srcdoc
 * @returns Double-buffer slots with the document visible in slot 0
 */
export function createPreviewSlots(
  srcdoc: string,
  token: string
): PreviewSlots {
  return [
    { srcdoc, role: "active", token },
    IDLE_SLOT,
  ]
}

/**
 * @param index - Slot index
 * @returns The other buffer index
 */
export function otherPreviewSlot(index: PreviewSlotIndex): PreviewSlotIndex {
  return index === 0 ? 1 : 0
}

/**
 * @param slots - Current double-buffer slots
 * @param role - Role to find
 * @returns Matching slot index, or null
 */
export function findPreviewSlot(
  slots: PreviewSlots,
  role: PreviewSlotRole
): PreviewSlotIndex | null {
  if (slots[0].role === role) {
    return 0
  }
  if (slots[1].role === role) {
    return 1
  }
  return null
}

/**
 * Slot React should paint. Never prefers a blank "active" placeholder over a
 * loading document — that is the cold-start white screen.
 *
 * @param slots - Current double-buffer slots
 * @returns Index of the iframe that should be visible
 */
export function visiblePreviewSlot(slots: PreviewSlots): PreviewSlotIndex {
  const active = findPreviewSlot(slots, "active")
  if (active !== null && !isBlankPreviewSrcdoc(slots[active].srcdoc)) {
    return active
  }

  const loading = findPreviewSlot(slots, "loading")
  if (loading !== null && !isBlankPreviewSrcdoc(slots[loading].srcdoc)) {
    return loading
  }

  if (active !== null) {
    return active
  }
  if (loading !== null) {
    return loading
  }
  return 0
}

/**
 * Stable iframe identity for a slot. Token changes remount the iframe so
 * `srcDoc` is applied on a fresh element (in-place `srcDoc` updates are flaky).
 *
 * @param index - Slot index
 * @param slot - Slot to key
 * @returns React key for that iframe
 */
export function previewSlotKey(
  index: PreviewSlotIndex,
  slot: PreviewSlot
): string {
  return `preview-${index}-${slot.token || "idle"}`
}

function writeSlot(
  slots: PreviewSlots,
  index: PreviewSlotIndex,
  slot: PreviewSlot
): PreviewSlots {
  return index === 0 ? [slot, slots[1]] : [slots[0], slot]
}

function queueTargetSlot(slots: PreviewSlots): PreviewSlotIndex {
  const active = findPreviewSlot(slots, "active")
  if (active === null) {
    return 0
  }
  if (isBlankPreviewSrcdoc(slots[active].srcdoc)) {
    return active
  }
  return otherPreviewSlot(active)
}

/**
 * Queues srcdoc into a buffer iframe. The first real document occupies a blank
 * visible slot; later documents load in the hidden slot so the painted iframe
 * stays put until ready.
 *
 * @param slots - Current double-buffer slots
 * @param srcdoc - Next tagged srcdoc
 * @param token - Runtime token baked into that srcdoc
 * @returns Slots with a loading buffer
 */
export function queuePreviewSrcdoc(
  slots: PreviewSlots,
  srcdoc: string,
  token: string
): PreviewSlots {
  const loading = findPreviewSlot(slots, "loading")
  if (loading !== null) {
    return writeSlot(slots, loading, { srcdoc, role: "loading", token })
  }

  return writeSlot(slots, queueTargetSlot(slots), {
    srcdoc,
    role: "loading",
    token,
  })
}

/**
 * Promotes a loaded buffer and blanks the previous iframe so its JS stops.
 *
 * @param slots - Current double-buffer slots
 * @param loaded - Slot that finished loading
 * @returns Updated slots, or null if the slot was not loading
 */
export function completePreviewLoad(
  slots: PreviewSlots,
  loaded: PreviewSlotIndex
): PreviewSlots | null {
  if (slots[loaded].role !== "loading") {
    return null
  }

  const blank: PreviewSlots = [IDLE_SLOT, IDLE_SLOT]

  return writeSlot(blank, loaded, {
    srcdoc: slots[loaded].srcdoc,
    role: "active",
    token: slots[loaded].token,
  })
}
