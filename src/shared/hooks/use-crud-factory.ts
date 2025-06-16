"use client"

import { useState, useCallback } from "react"

export type CrudItem = {
  id: string
  [key: string]: any
}

export type CrudOperations<T extends CrudItem> = {
  create: (item: Omit<T, "id" | "createdAt" | "updatedAt">) => Promise<T>
  update: (id: string, updates: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>) => Promise<T>
  delete: (id: string) => Promise<void>
  getAll: () => Promise<T[]>
  getById?: (id: string) => Promise<T | undefined>
}

export function useCrudFactory<T extends CrudItem>(operations: CrudOperations<T>) {
  const [items, setItems] = useState<T[]>([])
  const [currentItem, setCurrentItem] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedItems = await operations.getAll()
      setItems(fetchedItems)

      // Set current item if none selected
      if (!currentItem && fetchedItems.length > 0) {
        setCurrentItem(fetchedItems[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items")
    } finally {
      setIsLoading(false)
    }
  }, [operations, currentItem])

  const createItem = useCallback(
    async (itemData: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      try {
        // Optimistic update - add temporary item immediately
        const tempItem = {
          id: `temp-${Date.now()}`,
          ...itemData,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as T

        // Update UI immediately
        setItems((prev) => [tempItem, ...prev])
        setCurrentItem(tempItem)

        // Call server operation
        const result = await operations.create(itemData)

        // Replace temp item with real item
        setItems((prev) => prev.map((item) => (item.id === tempItem.id ? result : item)))
        setCurrentItem(result)

        return result
      } catch (error) {
        // Remove optimistic update on error
        setItems((prev) => prev.filter((item) => !item.id.startsWith("temp-")))
        throw error
      }
    },
    [operations],
  )

  const updateItem = useCallback(
    async (id: string, updates: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>) => {
      try {
        // Optimistic update
        const optimisticUpdate = { ...updates, updatedAt: new Date() }
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...optimisticUpdate } : item)))

        if (currentItem?.id === id) {
          setCurrentItem((prev) => (prev ? { ...prev, ...optimisticUpdate } : prev))
        }

        // Call server operation
        const result = await operations.update(id, updates)

        // Update with server response
        setItems((prev) => prev.map((item) => (item.id === id ? result : item)))
        if (currentItem?.id === id) {
          setCurrentItem(result)
        }

        return result
      } catch (error) {
        // Revert optimistic update on error
        await loadItems()
        throw error
      }
    },
    [operations, currentItem, loadItems],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        // Optimistic update - remove item immediately
        const itemToDelete = items.find((item) => item.id === id)
        setItems((prev) => prev.filter((item) => item.id !== id))

        // If deleting current item, select another one
        if (currentItem?.id === id) {
          const remainingItems = items.filter((item) => item.id !== id)
          setCurrentItem(remainingItems.length > 0 ? remainingItems[0] : null)
        }

        // Call server operation
        await operations.delete(id)
      } catch (error) {
        // Revert optimistic update on error
        await loadItems()
        throw error
      }
    },
    [operations, items, currentItem, loadItems],
  )

  return {
    items,
    currentItem,
    setCurrentItem,
    createItem,
    updateItem,
    deleteItem,
    loadItems,
    isLoading,
    error,
  }
}
