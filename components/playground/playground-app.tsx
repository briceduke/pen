"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

export const PlaygroundApp = dynamic(
  () =>
    import("@/components/playground/playground-shell").then(
      (mod) => mod.PlaygroundShell
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-svh w-full rounded-none" />,
  }
)
