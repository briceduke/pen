import type {
  ConsoleFilter,
  ConsoleLevel,
  ConsoleMessage,
} from "@/lib/playground/types"

export interface ConsoleLevelCounts {
  readonly log: number
  readonly warn: number
  readonly error: number
}

/**
 * @param value - Toggle value from the console filter control
 * @returns Whether the value is a known filter
 */
export function isConsoleFilter(value: string): value is ConsoleFilter {
  return (
    value === "all" || value === "log" || value === "warn" || value === "error"
  )
}

/**
 * @param level - Console message level
 * @param filter - Active console filter
 * @returns Whether the message should be shown
 */
export function matchesConsoleFilter(
  level: ConsoleLevel,
  filter: ConsoleFilter
): boolean {
  if (filter === "all") {
    return true
  }
  if (filter === "log") {
    return level === "log" || level === "info"
  }
  return level === filter
}

/**
 * @param messages - Console messages from the preview
 * @param filter - Active console filter
 * @returns Messages that match the filter
 */
export function filterConsoleMessages(
  messages: readonly ConsoleMessage[],
  filter: ConsoleFilter
): readonly ConsoleMessage[] {
  return messages.filter((message) =>
    matchesConsoleFilter(message.level, filter)
  )
}

/**
 * @param messages - Console messages from the preview
 * @returns Counts grouped for filter badges
 */
export function countConsoleByLevel(
  messages: readonly ConsoleMessage[]
): ConsoleLevelCounts {
  let log = 0
  let warn = 0
  let error = 0

  for (const message of messages) {
    if (message.level === "warn") {
      warn += 1
    } else if (message.level === "error") {
      error += 1
    } else {
      log += 1
    }
  }

  return { log, warn, error }
}
