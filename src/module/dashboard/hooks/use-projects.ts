"use client"

import { useEffect } from "react"
import { getProjectsQuery } from "@/module/project/api/queries/get-projects"
import { createProjectMutation } from "@/module/project/api/mutations/create-project"
import { updateProjectMutation } from "@/module/project/api/mutations/update-project"
import { deleteProjectMutation } from "@/module/project/api/mutations/delete-project"
import { useCrudFactory } from "@/shared/hooks/use-crud-factory"
import { TProject, TNewProject } from "@/module/project/api/schema/project-schema"

export function useProjects() {
  const crudOperations = {
    getAll: async (): Promise<TProject[]> => {
      return await getProjectsQuery()
    },
    create: async (projectData: TNewProject): Promise<TProject> => {
      const formData = new FormData()
      formData.append("name", projectData.name)
      if (projectData.description) formData.append("description", projectData.description)
      if (projectData.color) formData.append("color", projectData.color)
      if (projectData.icon) formData.append("icon", projectData.icon)

      const result = await createProjectMutation(formData)
      if (!result.success || !result.project) {
        throw new Error(result.error || "Failed to create project")
      }
      return result.project
    },
    update: async (id: string, updates: Partial<TNewProject>): Promise<TProject> => {
      const result = await updateProjectMutation(id, updates)
      if (!result.success || !result.project) {
        throw new Error(result.error || "Failed to update project")
      }
      return result.project
    },
    delete: async (id: string): Promise<void> => {
      const result = await deleteProjectMutation(id)
      if (!result.success) {
        throw new Error(result.error || "Failed to delete project")
      }
    }
  }

  const crud = useCrudFactory<TProject, TNewProject>(crudOperations)

  useEffect(() => {
    crud.loadItems()
  }, [])

  return {
    projects: crud.items,
    currentProject: crud.currentItem,
    setCurrentProject: crud.setCurrentItem,
    createProject: crud.createItem,
    updateProject: crud.updateItem,
    deleteProject: crud.deleteItem,
    isLoading: crud.isLoading,
    error: crud.error,
    refetch: crud.loadItems,
  }
}
