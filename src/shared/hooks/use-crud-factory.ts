"use client"

import { useState, useCallback } from "react"
import { TBaseEntity } from "../types/base"

export type TCrudItem = TBaseEntity;

export type TCrudOperations<T extends TCrudItem, U = Omit<T, keyof TBaseEntity>> = {
  create: (item: U) => Promise<T>
  update: (id: string, updates: Partial<U>) => Promise<T>
  delete: (id: string) => Promise<void>
  getAll: () => Promise<T[]>
  getById?: (id: string) => Promise<T | undefined>
}

export function useCrudFactory<T extends TCrudItem, U = Omit<T, keyof TBaseEntity>>(operations: TCrudOperations<T, U>) {
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
  }, [operations])

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
        setCurrentItem((current) => current?.id === id ? result : current)
        return result
      } catch (error) {
        await loadItems()
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [operations, loadItems],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await operations.delete(id)
        setItems((prev) => {
          const newItems = prev.filter((item) => item.id !== id)
          setCurrentItem((current) =>
            current?.id === id
              ? newItems.length > 0 ? newItems[0] : null
              : current
          )
          return newItems
        })
      } catch (error) {
        await loadItems()
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [operations, loadItems],
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
