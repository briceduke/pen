"use client"

import { useEffect, useState } from "react"

function readPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * @returns Whether the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    readPrefersReducedMotion
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")

    function onChange(event: MediaQueryListEvent): void {
      setPrefersReducedMotion(event.matches)
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}
