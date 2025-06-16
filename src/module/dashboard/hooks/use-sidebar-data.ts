"use client"

import { useState, useEffect } from "react"
import type { tSidebarData } from "../types/sidebar-types"
import { getSidebarData } from "../repositories/sidebar-repository"

export function useSidebarData() {
  const [data, setData] = useState<tSidebarData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const sidebarData = await getSidebarData()
        setData(sidebarData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sidebar data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, isLoading, error }
}
