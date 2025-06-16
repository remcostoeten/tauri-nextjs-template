"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { AlertTriangle } from "lucide-react"
import type { t_project } from "@/api/db/schema"

type DeleteProjectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: t_project | null
  onDeleteProject: (id: string) => Promise<void>
}

export function DeleteProjectDialog({ open, onOpenChange, project, onDeleteProject }: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!project) return

    setIsLoading(true)
    setError(null)

    try {
      await onDeleteProject(project.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete project:", error)
      setError("Failed to delete project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20">
              <AlertTriangle className="size-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Delete Project</DialogTitle>
              <DialogDescription className="text-[#b4b4b4] mt-1">This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          <div className="p-4 bg-[#2a2a2a] rounded-lg">
            <p className="text-sm text-[#b4b4b4] mb-2">You are about to delete:</p>
            <div className="flex items-center gap-3">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg text-white font-bold text-sm"
                style={{ backgroundColor: project.color || "#f76808" }}
              >
                {project.icon || "📁"}
              </div>
              <div>
                <div className="font-semibold text-white">{project.name}</div>
                {project.description && <div className="text-xs text-[#b4b4b4]">{project.description}</div>}
              </div>
            </div>
          </div>

          <p className="text-sm text-[#b4b4b4]">
            All tasks, files, and data associated with this project will be permanently deleted.
          </p>

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
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
