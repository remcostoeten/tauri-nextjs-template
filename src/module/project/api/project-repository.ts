import { eq } from "drizzle-orm"
import { db } from "@/api/db/connection"
import { projects, type TProject, type TNewProject } from "@/api/db/schema"
import { sql } from "drizzle-orm"

export async function getAllProjects(): Promise<TProject[]> {
  return await db.select().from(projects).where(eq(projects.isActive, true))
}

export async function getProjectById(id: string): Promise<TProject | undefined> {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return result[0]
}

export async function createProject(project: TNewProject): Promise<TProject> {
  const result = await db.insert(projects).values(project).returning()
  return result[0]
}

export async function updateProject(id: string, updates: Partial<TNewProject>): Promise<TProject> {
  const result = await db
    .update(projects)
    .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(projects.id, id))
    .returning()
  return result[0]
}

export async function deleteProject(id: string): Promise<void> {
  await db.update(projects).set({ isActive: false, updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(projects.id, id))
}
