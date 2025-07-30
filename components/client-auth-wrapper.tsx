"use client"
import type { ReactNode } from "react"

interface ClientAuthWrapperProps {
  children: ReactNode
}

export function ClientAuthWrapper({ children }: ClientAuthWrapperProps) {
  return <>{children}</>
}
