"use server"

import { revalidatePath } from "next/cache"
import { createProject } from "../project-repository"
import type { TNewProject } from "@/api/db/schema"

export async function createProjectMutation(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string | null
    const color = formData.get("color") as string | null
    const icon = formData.get("icon") as string | null

    if (!name) {
      throw new Error("Project name is required")
    }

    const projectData: TNewProject = {
      name,
      description: description || null,
      color: color || "#f76808",
      icon: icon || "Folder",
    }

    const project = await createProject(projectData)

    revalidatePath("/")
    return { success: true, project }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" }
  }
} 