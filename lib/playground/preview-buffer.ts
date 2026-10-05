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
    { srcdoc: BLANK_PREVIEW_SRCDOC, role: "idle", token: "" },
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

function writeSlot(
  slots: PreviewSlots,
  index: PreviewSlotIndex,
  slot: PreviewSlot
): PreviewSlots {
  return index === 0 ? [slot, slots[1]] : [slots[0], slot]
}

/**
 * Queues srcdoc into the hidden iframe so the visible document stays put.
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

  const active = findPreviewSlot(slots, "active") ?? 0
  const target = otherPreviewSlot(active)
  return writeSlot(slots, target, { srcdoc, role: "loading", token })
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

  const blank: PreviewSlots = [
    { srcdoc: BLANK_PREVIEW_SRCDOC, role: "idle", token: "" },
    { srcdoc: BLANK_PREVIEW_SRCDOC, role: "idle", token: "" },
  ]

  return writeSlot(blank, loaded, {
    srcdoc: slots[loaded].srcdoc,
    role: "active",
    token: slots[loaded].token,
  })
}
