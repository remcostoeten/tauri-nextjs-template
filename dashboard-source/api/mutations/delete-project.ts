"use server"

import { deleteProject } from "../repositories/project-repository"
import { revalidatePath } from "next/cache"

export async function deleteProjectMutation(id: string) {
  try {
    if (!id) {
      throw new Error("Project ID is required")
    }

    await deleteProject(id)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete project" }
  }
}
