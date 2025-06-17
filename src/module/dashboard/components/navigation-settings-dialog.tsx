"use client"

import * as React from "react"
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
import { GripVertical, Eye, EyeOff, Edit2, Check, X, Star } from "lucide-react"
import type { TNavigationItem, TNavigationPreferenceUI } from "../types/sidebar-types"
import { cn } from "@/shared/lib/utils"

type NavigationSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigationItems: TNavigationItem[];
  onSave: (preferences: TNavigationPreferenceUI[]) => Promise<void>;
  currentPreferences: TNavigationPreferenceUI[];
};

type SortableNavigationItemProps = {
  item: TNavigationItem;
  onToggleVisibility: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
};

function SortableNavigationItem({
  item,
  onToggleVisibility,
  onToggleFavorite,
  onUpdateLabel,
}: SortableNavigationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(item.customLabel || item.title)

  const handleLabelSave = () => {
    onUpdateLabel(item.id, label)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg",
        isDragging && "opacity-50"
      )}
    >
      <button
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-[#b4b4b4] hover:text-white"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="flex items-center gap-3 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-8 bg-[#1a1a1a] border-[#3a3a3a]"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLabelSave}
              className="h-8 px-2 hover:bg-[#3a3a3a]"
            >
              <Check className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setLabel(item.customLabel || item.title)
                setIsEditing(false)
              }}
              className="h-8 px-2 hover:bg-[#3a3a3a]"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1">{item.customLabel || item.title}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-[#3a3a3a]"
            >
              <Edit2 className="size-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onToggleFavorite(item.id)}
          className={cn(
            "h-8 w-8 p-0 hover:bg-[#3a3a3a]",
            item.isFavorite && "text-red-400  AAAA"
          )}
        >
          <Star className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onToggleVisibility(item.id)}
          className="h-8 w-8 p-0 hover:bg-[#3a3a3a]"
        >
          {item.isVisible ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </Button>
      </div>
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
  const [items, setItems] = useState<TNavigationItem[]>([])
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

      const initialItems = navigationItems.map((item, index) => {
        const pref = prefsMap.get(item.id)
        return {
          ...item,
          isVisible: pref ? pref.isVisible === 1 : true,
          isFavorite: pref ? pref.isFavorite === 1 : false,
          position: pref?.position ?? index,
          customLabel: pref?.customLabel,
        }
      })

      // Sort by position
      initialItems.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      setItems(initialItems)
      setError(null)
    }
  }, [open, navigationItems, currentPreferences])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          position: index,
        }))
      })
    }
  }

  function handleToggleVisibility(id: string) {
    setItems((items) => items.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item)))
  }

  function handleToggleFavorite(id: string) {
    setItems((items) => items.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)))
  }

  function handleUpdateLabel(id: string, label: string) {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, customLabel: label } : item)),
    )
  }

  async function handleSave() {
    setIsLoading(true)
    setError(null)

    try {
      const preferences: TNavigationPreferenceUI[] = items.map((item, index) => ({
        itemId: item.id,
        isVisible: item.isVisible ? 1 : 0,
        isFavorite: item.isFavorite ? 1 : 0,
        position: index,
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
    const resetItems = navigationItems.map((item, index) => ({
      ...item,
      isVisible: true,
      isFavorite: false,
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
          <p className="text-sm text-[#b4b4b4]">Drag to reorder, toggle visibility, favorites, and customize labels</p>
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
                      onToggleFavorite={handleToggleFavorite}
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
              <li>• Toggle the eye icon to show/hide items</li>
              <li>• Toggle the star icon to favorite items</li>
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
            className="flex-1 bg-red-400  AAAA hover:bg-[#e55a00] text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
