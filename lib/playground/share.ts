import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"
import { z } from "zod"

import type {
  PlaygroundDocument,
  ShareLocation,
  ShareUrlHealth,
} from "@/lib/playground/types"

export const SHARE_URL_SOFT_LIMIT = 2048
export const SHARE_URL_HARD_LIMIT = 8192

const SHARE_PARAM = "d" as const

export const playgroundDocumentSchema = z.object({
  v: z.literal(1),
  html: z.string(),
  css: z.string(),
  js: z.string(),
  autoRun: z.boolean().optional(),
  exampleId: z.string().optional(),
})

/**
 * Compresses a playground document for hash or query sharing.
 *
 * @param document - Playground HTML/CSS/JS payload
 * @returns URI-safe compressed string
 */
export function encodePlaygroundDocument(
  document: PlaygroundDocument
): string {
  const payload: PlaygroundDocument = {
    v: 1,
    html: document.html,
    css: document.css,
    js: document.js,
    autoRun: document.autoRun,
    exampleId: document.exampleId,
  }

  return compressToEncodedURIComponent(JSON.stringify(payload))
}

/**
 * Decodes a compressed share payload.
 *
 * @param encoded - Value from `d` hash or query param
 * @returns Valid document, or null if the payload is invalid
 */
export function decodePlaygroundDocument(
  encoded: string
): PlaygroundDocument | null {
  const json = decompressFromEncodedURIComponent(encoded)
  if (!json) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(json)
    const result = playgroundDocumentSchema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

function readParam(params: URLSearchParams): string | null {
  const value = params.get(SHARE_PARAM)
  return value && value.length > 0 ? value : null
}

/**
 * Reads a shared document from hash (`#d=`) or query (`?d=`). Hash wins.
 *
 * @param locationLike - Window location search + hash
 * @returns Decoded document, or null when nothing valid is present
 */
export function readShareFromLocation(
  locationLike: ShareLocation
): PlaygroundDocument | null {
  const hash = locationLike.hash.startsWith("#")
    ? locationLike.hash.slice(1)
    : locationLike.hash
  const fromHash = readParam(new URLSearchParams(hash))
  const fromQuery = readParam(new URLSearchParams(locationLike.search))
  const encoded = fromHash ?? fromQuery

  return encoded ? decodePlaygroundDocument(encoded) : null
}

/**
 * Builds a share URL that stores the document in the hash (client-only).
 *
 * @param origin - Location origin
 * @param pathname - Location pathname
 * @param encoded - Compressed document
 * @returns Absolute share URL
 */
export function buildShareUrl(
  origin: string,
  pathname: string,
  encoded: string
): string {
  return `${origin}${pathname}#${SHARE_PARAM}=${encoded}`
}

/**
 * Replaces the current history entry with a hash-encoded document.
 *
 * @param encoded - Compressed document
 */
export function replaceShareHash(encoded: string): void {
  const url = new URL(window.location.href)
  url.searchParams.delete(SHARE_PARAM)
  url.hash = `${SHARE_PARAM}=${encoded}`
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
}

/**
 * @param characterCount - Full share URL length
 * @returns Health bucket for copy feedback
 */
export function classifyShareUrlLength(characterCount: number): ShareUrlHealth {
  if (characterCount > SHARE_URL_HARD_LIMIT) {
    return "tooLong"
  }
  if (characterCount > SHARE_URL_SOFT_LIMIT) {
    return "long"
  }
  return "ok"
}

/**
 * @param characterCount - Full share URL length
 * @returns Toast copy after a successful clipboard write
 */
export function formatShareCopiedMessage(characterCount: number): string {
  const health = classifyShareUrlLength(characterCount)
  if (health === "tooLong") {
    return `Copied · ${characterCount.toLocaleString()} chars. This URL may fail in some browsers.`
  }
  if (health === "long") {
    return `Copied · ${characterCount.toLocaleString()} chars. Some apps truncate long links.`
  }
  return "Share URL copied"
}
