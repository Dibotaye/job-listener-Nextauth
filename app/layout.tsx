import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "Job Opportunities",
  description: "Find your next opportunity",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className={GeistSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
