"use server"

import { createProject } from "../repositories/project-repository"
import { revalidatePath } from "next/cache"
import type { t_new_project } from "../db/schema"

export async function createProjectMutation(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string
    const icon = formData.get("icon") as string

    if (!name) {
      throw new Error("Project name is required")
    }

    const newProject: t_new_project = {
      name,
      description: description || null,
      color: color || "#f76808",
      icon: icon || "Folder",
    }

    const project = await createProject(newProject)

    revalidatePath("/")
    return { success: true, project }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" }
  }
}
