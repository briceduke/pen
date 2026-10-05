import type {
  ConsoleLevel,
  PlaygroundDocument,
  PreviewReadyEvent,
  PreviewRestoreScrollMessage,
  PreviewScrollEvent,
  PreviewScrollPosition,
} from "@/lib/playground/types"

const CONSOLE_SOURCE = "pen-console" as const
const PREVIEW_SOURCE = "pen-preview" as const
const HOST_SOURCE = "pen-host" as const

export const PREVIEW_RUNTIME_TOKEN_PLACEHOLDER = "PEN_RUNTIME_TOKEN_9f3c2a"

function escapeClosingTag(source: string, tag: string): string {
  const pattern = new RegExp(`</${tag}`, "gi")
  return source.replace(pattern, `<\\/${tag}`)
}

function buildConsoleBridge(): string {
  return `
(() => {
  const levels = ["log", "info", "warn", "error"];
  window.__penStartupLogs = [];
  function serialize(value) {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch { return String(value); }
  }
  function send(level, args) {
    const serialized = args.map(serialize);
    if (Array.isArray(window.__penStartupLogs)) {
      window.__penStartupLogs.push({ level: level, args: serialized });
    }
    parent.postMessage({ source: "${CONSOLE_SOURCE}", token: "${PREVIEW_RUNTIME_TOKEN_PLACEHOLDER}", level: level, args: serialized }, "*");
  }
  for (const level of levels) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      send(level, args);
      original(...args);
    };
  }
  window.addEventListener("error", (event) => {
    send("error", [event.message]);
  });
  window.addEventListener("unhandledrejection", (event) => {
    send("error", [String(event.reason)]);
  });
})();
`
}

function buildPreviewRuntime(): string {
  return `
(() => {
  const token = "${PREVIEW_RUNTIME_TOKEN_PLACEHOLDER}";
  function onHostMessage(event) {
    if (event.source !== parent) return;
    const data = event.data;
    if (!data || data.source !== "${HOST_SOURCE}" || data.type !== "restore-scroll") return;
    window.scrollTo(Number(data.x) || 0, Number(data.y) || 0);
  }
  function reportScroll() {
    parent.postMessage({ source: "${PREVIEW_SOURCE}", type: "scroll", token: token, x: window.scrollX, y: window.scrollY }, "*");
  }
  window.addEventListener("message", onHostMessage);
  window.addEventListener("scroll", reportScroll, { passive: true });
  parent.postMessage({
    source: "${PREVIEW_SOURCE}",
    type: "ready",
    token: token,
    logs: Array.isArray(window.__penStartupLogs) ? window.__penStartupLogs : []
  }, "*");
  window.__penStartupLogs = null;
})();
`
}

/**
 * Builds a srcdoc HTML document for the sandboxed preview iframe.
 *
 * @param document - Current editor contents
 * @returns Full HTML string for iframe srcdoc
 */
export function buildPreviewSrcdoc(document: PlaygroundDocument): string {
  const css = escapeClosingTag(document.css, "style")
  const html = document.html
  const js = escapeClosingTag(document.js, "script")
  const bridge = escapeClosingTag(buildConsoleBridge(), "script")
  const runtime = escapeClosingTag(buildPreviewRuntime(), "script")

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${bridge}</script>
    <script>
      try {
        ${js}
      } catch (error) {
        console.error(error && error.message ? error.message : String(error));
      }
    </script>
    <script>${runtime}</script>
  </body>
</html>`
}

/**
 * @param srcdoc - Srcdoc containing the runtime token placeholder
 * @param token - Per-load token used to ignore stale ready messages
 * @returns Srcdoc with the token substituted
 */
export function applyPreviewRuntimeToken(srcdoc: string, token: string): string {
  return srcdoc.replaceAll(PREVIEW_RUNTIME_TOKEN_PLACEHOLDER, token)
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null
}

/**
 * @param data - postMessage payload
 * @returns Whether the payload is a playground console event
 */
export function isPreviewConsoleEvent(
  data: unknown
): data is {
  source: typeof CONSOLE_SOURCE
  token: string
  level: ConsoleLevel
  args: unknown[]
} {
  if (!isRecord(data)) {
    return false
  }

  const levels: readonly ConsoleLevel[] = ["log", "info", "warn", "error"]

  return (
    data.source === CONSOLE_SOURCE &&
    typeof data.token === "string" &&
    typeof data.level === "string" &&
    levels.includes(data.level as ConsoleLevel) &&
    Array.isArray(data.args)
  )
}

/**
 * @param data - postMessage payload
 * @returns Whether the payload is a preview-ready handshake
 */
export function isPreviewReadyEvent(data: unknown): data is PreviewReadyEvent {
  return (
    isRecord(data) &&
    data.source === PREVIEW_SOURCE &&
    data.type === "ready" &&
    typeof data.token === "string" &&
    Array.isArray(data.logs)
  )
}

/**
 * @param value - Item from a ready-event log buffer
 * @returns Whether the item is a console log payload
 */
export function isPreviewReadyLog(
  value: unknown
): value is { level: ConsoleLevel; args: unknown[] } {
  if (!isRecord(value)) {
    return false
  }

  const levels: readonly ConsoleLevel[] = ["log", "info", "warn", "error"]
  return (
    typeof value.level === "string" &&
    levels.includes(value.level as ConsoleLevel) &&
    Array.isArray(value.args)
  )
}

/**
 * @param data - postMessage payload
 * @returns Whether the payload reports iframe scroll
 */
export function isPreviewScrollEvent(data: unknown): data is PreviewScrollEvent {
  return (
    isRecord(data) &&
    data.source === PREVIEW_SOURCE &&
    data.type === "scroll" &&
    typeof data.token === "string" &&
    typeof data.x === "number" &&
    typeof data.y === "number"
  )
}

/**
 * @param scroll - Last known preview scroll position
 * @returns Host message that restores scroll inside the iframe
 */
export function buildRestoreScrollMessage(
  scroll: PreviewScrollPosition
): PreviewRestoreScrollMessage {
  return {
    source: HOST_SOURCE,
    type: "restore-scroll",
    x: scroll.x,
    y: scroll.y,
  }
}

/**
 * @param args - Console arguments from the iframe
 * @returns Display strings for the console panel
 */
export function stringifyConsoleArgs(args: readonly unknown[]): readonly string[] {
  return args.map((arg) => {
    if (typeof arg === "string") {
      return arg
    }
    try {
      return JSON.stringify(arg)
    } catch {
      return String(arg)
    }
  })
}
