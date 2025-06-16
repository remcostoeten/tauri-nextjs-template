"use client"

import { useEffect } from "react"
import { useCrudFactory } from "./use-crud-factory"
import { getProjectsQuery } from "../api/queries/get-projects"
import { createProjectMutation } from "../api/mutations/create-project"
import { updateProjectMutation } from "../api/mutations/update-project"
import { deleteProjectMutation } from "../api/mutations/delete-project"
import { t_project } from "@/module/projects/api/schema/project-schema"
 
export function useProjects() {
  const crudOperations = {
    getAll: async (): Promise<t_project[]> => {
      return await getProjectsQuery()
    },
    create: async (projectData: Omit<t_project, "id" | "createdAt" | "updatedAt">): Promise<t_project> => {
      const formData = new FormData()
      formData.append("name", projectData.name)
      if (projectData.description) formData.append("description", projectData.description)
      if (projectData.color) formData.append("color", projectData.color)
      if (projectData.icon) formData.append("icon", projectData.icon)

      const result = await createProjectMutation(formData)
      if (!result.success) {
        throw new Error(result.error || "Failed to create project")
      }
      return result.project
    },
    update: async (id: string, updates: Partial<t_new_project>): Promise<t_project> => {
      const result = await updateProjectMutation(id, updates)
      if (!result.success) {
        throw new Error(result.error || "Failed to update project")
      }
      return result.project
    },
    delete: async (id: string): Promise<void> => {
      const result = await deleteProjectMutation(id)
      if (!result.success) {
        throw new Error(result.error || "Failed to delete project")
      }
    },
  }

  const crud = useCrudFactory<t_project>(crudOperations)

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
