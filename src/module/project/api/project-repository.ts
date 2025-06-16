import { eq } from "drizzle-orm"
import { db } from "@/api/db/connection"
import { projects, type t_project, type t_new_project } from "@/api/db/schema"

export async function getAllProjects(): Promise<t_project[]> {
  return await db.select().from(projects).where(eq(projects.isActive, true))
}

export async function getProjectById(id: string): Promise<t_project | undefined> {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return result[0]
}

export async function createProject(project: t_new_project): Promise<t_project> {
  const result = await db.insert(projects).values(project).returning()
  return result[0]
}

export async function updateProject(id: string, updates: Partial<t_new_project>): Promise<t_project> {
  const result = await db
    .update(projects)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning()
  return result[0]
}

export async function deleteProject(id: string): Promise<void> {
  await db.update(projects).set({ isActive: false, updatedAt: new Date() }).where(eq(projects.id, id))
}
