"use server"

import { updateProject } from "../repositories/project-repository"
import { revalidatePath } from "next/cache"
import type { t_new_project } from "../db/schema"

export async function updateProjectMutation(id: string, updates: Partial<t_new_project>) {
  try {
    if (!id) {
      throw new Error("Project ID is required")
    }

    const project = await updateProject(id, updates)

    revalidatePath("/")
    return { success: true, project }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project" }
  }
}
