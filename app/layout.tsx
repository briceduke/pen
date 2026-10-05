import type { Metadata } from "next"
import { Figtree, Geist_Mono } from "next/font/google"
import { Suspense } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Pen — live HTML, CSS, and JS",
  description:
    "A CodePen-style playground that runs HTML, CSS, and JavaScript entirely in the browser.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <body className="h-full overflow-hidden">
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
