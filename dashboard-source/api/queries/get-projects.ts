"use server"

import { getAllProjects, getProjectById } from "../repositories/project-repository"

export async function getProjectsQuery() {
  return await getAllProjects()
}

export async function getProjectQuery(id: string) {
  return await getProjectById(id)
}
