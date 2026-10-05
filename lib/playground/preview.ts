import type { ConsoleLevel, PlaygroundDocument } from "@/lib/playground/types"

const CONSOLE_SOURCE = "pen-console" as const

function escapeClosingTag(source: string, tag: string): string {
  const pattern = new RegExp(`</${tag}`, "gi")
  return source.replace(pattern, `<\\/${tag}`)
}

function buildConsoleBridge(): string {
  return `
(() => {
  const levels = ["log", "info", "warn", "error"];
  function serialize(value) {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch { return String(value); }
  }
  function send(level, args) {
    parent.postMessage({ source: "${CONSOLE_SOURCE}", level, args: args.map(serialize) }, "*");
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
  </body>
</html>`
}

/**
 * @param data - postMessage payload
 * @returns Whether the payload is a playground console event
 */
export function isPreviewConsoleEvent(
  data: unknown
): data is { source: typeof CONSOLE_SOURCE; level: ConsoleLevel; args: unknown[] } {
  if (typeof data !== "object" || data === null) {
    return false
  }

  const event = data as Record<string, unknown>
  const levels: readonly ConsoleLevel[] = ["log", "info", "warn", "error"]

  return (
    event.source === CONSOLE_SOURCE &&
    typeof event.level === "string" &&
    levels.includes(event.level as ConsoleLevel) &&
    Array.isArray(event.args)
  )
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
