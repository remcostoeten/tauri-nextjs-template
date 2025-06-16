"use client"

import { useState, useCallback } from "react"

export type CrudItem = {
  id: string
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  [key: string]: any
}

export type CrudOperations<T extends CrudItem, U = Omit<T, "id" | "createdAt" | "updatedAt">> = {
  create: (item: U) => Promise<T>
  update: (id: string, updates: Partial<U>) => Promise<T>
  delete: (id: string) => Promise<void>
  getAll: () => Promise<T[]>
  getById?: (id: string) => Promise<T | undefined>
}

export function useCrudFactory<T extends CrudItem, U = Omit<T, "id" | "createdAt" | "updatedAt">>(operations: CrudOperations<T, U>) {
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
    async (itemData: U) => {
      setIsLoading(true)
      try {
        const result = await operations.create(itemData)
        setItems((prev) => [result, ...prev])
        setCurrentItem(result)
        return result
      } catch (error) {
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [operations],
  )

  const updateItem = useCallback(
    async (id: string, updates: Partial<U>) => {
      setIsLoading(true)
      try {
        const result = await operations.update(id, updates)
        setItems((prev) => prev.map((item) => (item.id === id ? result : item)))
        if (currentItem?.id === id) {
          setCurrentItem(result)
        }
        return result
      } catch (error) {
        await loadItems()
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [operations, currentItem, loadItems],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await operations.delete(id)
        setItems((prev) => prev.filter((item) => item.id !== id))
        if (currentItem?.id === id) {
          const remainingItems = items.filter((item) => item.id !== id)
          setCurrentItem(remainingItems.length > 0 ? remainingItems[0] : null)
        }
      } catch (error) {
        await loadItems()
        throw error
      } finally {
        setIsLoading(false)
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
