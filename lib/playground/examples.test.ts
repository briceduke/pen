import { describe, expect, it } from "vitest"

import {
  DEFAULT_EXAMPLE_ID,
  findStarterExample,
  STARTER_EXAMPLES,
} from "@/lib/playground/examples"

describe("starter examples", () => {
  it("ships multiple named starters", () => {
    expect(STARTER_EXAMPLES.length).toBeGreaterThanOrEqual(3)
    expect(STARTER_EXAMPLES.every((example) => example.name.length > 0)).toBe(
      true
    )
    expect(STARTER_EXAMPLES.some((example) => example.id === "blank")).toBe(
      true
    )
  })

  it("falls back to the default example", () => {
    expect(findStarterExample("missing").id).toBe(DEFAULT_EXAMPLE_ID)
  })
})
