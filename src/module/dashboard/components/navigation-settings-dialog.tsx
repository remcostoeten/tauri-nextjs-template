"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { GripVertical, Eye, EyeOff, Edit2, Check, X } from "lucide-react"
import type { t_navigation_item } from "../types/sidebar-types"

type NavigationItem = t_navigation_item & {
  isVisible: boolean
  position: number
  customLabel?: string
}

type NavigationSettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  navigationItems: t_navigation_item[]
  onSave: (
    preferences: Array<{ itemId: string; isVisible: boolean; position: number; customLabel?: string }>,
  ) => Promise<void>
  currentPreferences: Array<{ itemId: string; isVisible: boolean; position: number; customLabel?: string }>
}

function SortableNavigationItem({
  item,
  onToggleVisibility,
  onUpdateLabel,
}: {
  item: NavigationItem
  onToggleVisibility: (id: string) => void
  onUpdateLabel: (id: string, label: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(item.customLabel || item.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  function handleSaveLabel() {
    onUpdateLabel(item.id, editLabel)
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditLabel(item.customLabel || item.title)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg border ${
        item.isVisible ? "border-[#3a3a3a]" : "border-[#3a3a3a]/50"
      } ${isDragging ? "shadow-lg" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-[#b4b4b4] hover:text-white"
      >
        <GripVertical className="size-4" />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={item.isVisible} onCheckedChange={() => onToggleVisibility(item.id)} />
        {item.isVisible ? <Eye className="size-4 text-green-400" /> : <EyeOff className="size-4 text-[#b4b4b4]" />}
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="bg-[#1a1a1a] border-[#3a3a3a] text-white text-sm"
              placeholder="Enter custom label..."
            />
            <Button size="sm" onClick={handleSaveLabel} className="bg-green-600 hover:bg-green-700 p-1">
              <Check className="size-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-[#3a3a3a] p-1">
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${item.isVisible ? "text-white" : "text-[#b4b4b4]"}`}>
              {item.customLabel || item.title}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="p-1 h-auto text-[#b4b4b4] hover:text-white"
            >
              <Edit2 className="size-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-[#b4b4b4] min-w-[3rem] text-right">#{item.position + 1}</div>
    </div>
  )
}

export function NavigationSettingsDialog({
  open,
  onOpenChange,
  navigationItems,
  onSave,
  currentPreferences,
}: NavigationSettingsDialogProps) {
  const [items, setItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Initialize items when dialog opens
  useEffect(() => {
    if (open) {
      const prefsMap = new Map(currentPreferences.map((pref) => [pref.itemId, pref]))

      const initialItems: NavigationItem[] = navigationItems.map((item, index) => {
        const pref = prefsMap.get(item.id)
        return {
          ...item,
          isVisible: pref?.isVisible ?? true,
          position: pref?.position ?? index,
          customLabel: pref?.customLabel,
        }
      })

      // Sort by position
      initialItems.sort((a, b) => a.position - b.position)
      setItems(initialItems)
      setError(null)
    }
  }, [open, navigationItems, currentPreferences])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update positions
        return newItems.map((item, index) => ({ ...item, position: index }))
      })
    }
  }

  function handleToggleVisibility(id: string) {
    setItems((items) => items.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item)))
  }

  function handleUpdateLabel(id: string, label: string) {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, customLabel: label !== item.title ? label : undefined } : item)),
    )
  }

  async function handleSave() {
    setIsLoading(true)
    setError(null)

    try {
      const preferences = items.map((item) => ({
        itemId: item.id,
        isVisible: item.isVisible,
        position: item.position,
        customLabel: item.customLabel,
      }))

      await onSave(preferences)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save navigation preferences:", error)
      setError("Failed to save preferences. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    const resetItems: NavigationItem[] = navigationItems.map((item, index) => ({
      ...item,
      isVisible: true,
      position: index,
      customLabel: undefined,
    }))

    setItems(resetItems)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customize Navigation</DialogTitle>
          <p className="text-sm text-[#b4b4b4]">Drag to reorder, toggle visibility, and customize labels</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Navigation Items</Label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableNavigationItem
                      key={item.id}
                      item={item}
                      onToggleVisibility={handleToggleVisibility}
                      onUpdateLabel={handleUpdateLabel}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="text-xs text-[#b4b4b4] p-3 bg-[#2a2a2a] rounded-lg">
            <strong>Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Drag items to reorder them</li>
              <li>• Toggle the switch to show/hide items</li>
              <li>• Click the edit icon to customize labels</li>
              <li>• Hidden items won't appear in the sidebar</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#2a2a2a]">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
            disabled={isLoading}
          >
            Reset to Default
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-[#f76808] hover:bg-[#e55a00] text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
