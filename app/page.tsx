import { Suspense } from "react"

import { PlaygroundApp } from "@/components/playground/playground-app"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <Suspense fallback={<Skeleton className="h-svh w-full rounded-none" />}>
      <PlaygroundApp />
    </Suspense>
  )
}
