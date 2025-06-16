"use server"

import { updateProject } from "@/module/project/api/project-repository"
import { type TNewProject } from "@/module/project/api/schema/project-schema"
import { revalidatePath } from "next/cache"

export async function updateProjectMutation(id: string, updates: Partial<TNewProject>) {
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
