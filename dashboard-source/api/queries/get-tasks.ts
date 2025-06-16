"use server"

import { getTasksByProject, getTaskById } from "../repositories/task-repository"

export async function getTasksQuery(projectId: string) {
  return await getTasksByProject(projectId)
}

export async function getTaskQuery(id: string) {
  return await getTaskById(id)
}
