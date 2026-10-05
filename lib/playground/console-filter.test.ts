import { describe, expect, it } from "vitest"

import {
  countConsoleByLevel,
  filterConsoleMessages,
  isConsoleFilter,
  matchesConsoleFilter,
} from "@/lib/playground/console-filter"
import type { ConsoleMessage } from "@/lib/playground/types"

function message(
  level: ConsoleMessage["level"],
  id: string
): ConsoleMessage {
  return { id, level, args: [id], timestamp: 0 }
}

const messages: readonly ConsoleMessage[] = [
  message("log", "a"),
  message("info", "b"),
  message("warn", "c"),
  message("error", "d"),
]

describe("console filters", () => {
  it("treats info as a log", () => {
    expect(matchesConsoleFilter("info", "log")).toBe(true)
    expect(matchesConsoleFilter("warn", "log")).toBe(false)
  })

  it("filters message lists", () => {
    expect(filterConsoleMessages(messages, "warn").map((item) => item.id)).toEqual([
      "c",
    ])
    expect(filterConsoleMessages(messages, "all")).toHaveLength(4)
  })

  it("counts levels with info folded into log", () => {
    expect(countConsoleByLevel(messages)).toEqual({
      log: 2,
      warn: 1,
      error: 1,
    })
  })

  it("narrows console filter values", () => {
    expect(isConsoleFilter("all")).toBe(true)
    expect(isConsoleFilter("debug")).toBe(false)
  })
})
