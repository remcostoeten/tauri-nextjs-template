"use server"

import { createTask } from "../repositories/task-repository"
import type { t_new_task } from "../db/schema"

export async function createTaskMutation(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const projectId = formData.get("projectId") as string
  const priority = formData.get("priority") as string

  if (!title || !projectId) {
    throw new Error("Task title and project are required")
  }

  const newTask: t_new_task = {
    title,
    description,
    projectId,
    priority: priority || "medium",
    status: "todo",
  }

  return await createTask(newTask)
}
