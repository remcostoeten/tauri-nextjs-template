"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { Folder, Rocket, Brain, Target, Zap, Star } from "lucide-react"
import { t_project, t_new_project } from "@/module/projects/api/schema/project-schema"

const projectColors = ["#f76808", "#e93d82", "#5842c8", "#35b979", "#ffcb47", "#ff6b6b", "#4ecdc4", "#45b7d1"]

const projectIcons = [
  { icon: Folder, name: "Folder" },
  { icon: Rocket, name: "Rocket" },
  { icon: Brain, name: "Brain" },
  { icon: Target, name: "Target" },
  { icon: Zap, name: "Zap" },
  { icon: Star, name: "Star" },
]

type EditProjectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: t_project | null
  onUpdateProject: (id: string, updates: Partial<t_new_project>) => Promise<any>
}

export function EditProjectDialog({ open, onOpenChange, project, onUpdateProject }: EditProjectDialogProps) {
  const [selectedColor, setSelectedColor] = useState(projectColors[0])
  const [selectedIcon, setSelectedIcon] = useState(projectIcons[0].name)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  // Initialize form when project changes
  useEffect(() => {
    if (project && open) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
      })
      setSelectedColor(project.color || projectColors[0])
      setSelectedIcon(project.icon || projectIcons[0].name)
      setError(null)
    }
  }, [project, open])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setError(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!project) return

    setIsLoading(true)
    setError(null)

    const name = formData.name
    const description = formData.description

    if (!name.trim()) {
      setError("Project name is required")
      setIsLoading(false)
      return
    }

    try {
      const updates: Partial<t_new_project> = {
        name: name.trim(),
        description: description.trim() || null,
        color: selectedColor,
        icon: selectedIcon,
      }

      await onUpdateProject(project.id, updates)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update project:", error)
      setError("Failed to update project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name..."
              className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#b4b4b4]"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="What's this project about?"
              className="bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#b4b4b4] resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {projectIcons.map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    selectedIcon === name
                      ? "bg-[#f76808] text-white shadow-lg"
                      : "bg-[#2a2a2a] text-[#b4b4b4] hover:bg-[#3a3a3a] hover:text-white"
                  } disabled:opacity-50`}
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Color</Label>
            <div className="flex gap-2 flex-wrap">
              {projectColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                    selectedColor === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-110"
                      : "hover:scale-105"
                  } disabled:opacity-50`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-[#f76808] hover:bg-[#e55a00] text-white">
              {isLoading ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
