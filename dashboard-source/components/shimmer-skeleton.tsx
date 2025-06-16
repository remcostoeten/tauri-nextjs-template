"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ShimmerSkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function ShimmerSkeleton({ className, children }: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#2a2a2a] rounded",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-[#3a3a3a]/50 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className,
      )}
    >
      {children}
    </div>
  )
}
