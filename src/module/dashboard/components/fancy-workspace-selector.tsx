"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  Check,
  Plus,
  Settings,
  Folder,
  Rocket,
  Brain,
  Target,
  Zap,
  Star,
  Edit,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { SidebarMenuButton } from "@/shared/ui/sidebar"
import type { TProject, TNewProject } from "@/module/project/api/schema/project-schema"
import { CreateProjectDialog } from "@/module/project/components/create-project-dialog"
import { DeleteProjectDialog } from "@/module/project/components/delete-project-dialog"
import { EditProjectDialog } from "@/module/project/components/edit-project-dialog"

const iconMap = {
  Folder,
  Rocket,
  Brain,
  Target,
  Zap,
  Star,
}

type FancyWorkspaceSelectorProps = {
  currentProject: TProject
  projects: TProject[]
  onProjectChange: (project: TProject) => void
  onCreateProject: (project: TNewProject) => Promise<any>
  onUpdateProject: (id: string, updates: Partial<TNewProject>) => Promise<any>
  onDeleteProject: (id: string) => Promise<void>
}

export function FancyWorkspaceSelector({
  currentProject,
  projects,
  onProjectChange,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: FancyWorkspaceSelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<TProject | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<TProject | null>(null)

  function getProjectIcon(iconName: string) {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Folder
    return IconComponent
  }

  function handleEditProject(project: TProject, event: React.MouseEvent) {
    event.stopPropagation()
    setProjectToEdit(project)
    setShowEditDialog(true)
  }

  function handleDeleteProject(project: TProject, event: React.MouseEvent) {
    event.stopPropagation()
    setProjectToDelete(project)
    setShowDeleteDialog(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            tooltip={currentProject.name}
            className="data-[state=open]:bg-[#2a2a2a] data-[state=open]:text-white hover:bg-[#2a2a2a] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className="flex aspect-square size-9 items-center justify-center rounded-xl text-white font-bold text-base shadow-lg ring-2 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
              style={{
                backgroundColor: currentProject.color || "#f76808",
                background: `linear-gradient(135deg, ${currentProject.color || "#f76808"}, ${currentProject.color || "#f76808"}dd)`,
              }}
            >
              {(() => {
                const IconComponent = getProjectIcon(currentProject.icon || "Folder")
                return <IconComponent className="size-4" />
              })()}
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-bold text-white text-base tracking-tight">{currentProject.name}</span>
              <span className="text-xs text-[#b4b4b4] font-medium">Project</span>
            </div>
            <ChevronDown className="ml-auto text-[#b4b4b4] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:rotate-180 group-hover:text-white" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[280px] bg-[#1a1a1a] border-[#2a2a2a] shadow-2xl"
          align="start"
          sideOffset={8}
        >
          <div className="p-2">
            <div className="text-xs font-medium text-[#b4b4b4] mb-2 px-2">Switch Project</div>
            {projects.map((project) => {
              const IconComponent = getProjectIcon(project.icon || "Folder")
              return (
                <div key={project.id} className="group/project-item relative">
                  <DropdownMenuItem
                    onSelect={() => onProjectChange(project)}
                    className="text-white hover:bg-[#2a2a2a] cursor-pointer rounded-lg p-3 transition-all duration-200 pr-16"
                  >
                    <div
                      className="flex aspect-square size-8 items-center justify-center rounded-lg text-white font-bold text-sm mr-3 shadow-md"
                      style={{
                        backgroundColor: project.color || "#f76808",
                        background: `linear-gradient(135deg, ${project.color || "#f76808"}, ${project.color || "#f76808"}dd)`,
                      }}
                    >
                      <IconComponent className="size-4" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold">{project.name}</span>
                      {project.description && (
                        <span className="text-xs text-[#b4b4b4] truncate">{project.description}</span>
                      )}
                    </div>
                    {project.id === currentProject.id && <Check className="size-4 text-red-400  AAAA" />}
                  </DropdownMenuItem>

                  {/* Action buttons */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/project-item:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditProject(project, e)}
                      className="p-1 rounded hover:bg-[#3a3a3a] text-[#b4b4b4] hover:text-white transition-colors"
                      title="Edit project"
                    >
                      <Edit className="size-3" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteProject(project, e)}
                        className="p-1 rounded hover:bg-red-600 text-[#b4b4b4] hover:text-white transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <DropdownMenuSeparator className="bg-[#2a2a2a] my-1" />

          <div className="p-2">
            <DropdownMenuItem
              onSelect={() => setShowCreateDialog(true)}
              className="text-white hover:bg-[#2a2a2a] cursor-pointer rounded-lg p-3 transition-all duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-400  AAAA text-white mr-3 shadow-md">
                <Plus className="size-4" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold">Create Project</span>
                <span className="text-xs text-[#b4b4b4]">Start something new</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-white hover:bg-[#2a2a2a] cursor-pointer rounded-lg p-3 transition-all duration-200">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#5842c8] text-white mr-3 shadow-md">
                <Settings className="size-4" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold">Project Settings</span>
                <span className="text-xs text-[#b4b4b4]">Manage preferences</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={onCreateProject}
      />

      <EditProjectDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        project={projectToEdit}
        onUpdateProject={onUpdateProject}
      />

      <DeleteProjectDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        project={projectToDelete}
        onDeleteProject={onDeleteProject}
      />
    </>
  )
}
