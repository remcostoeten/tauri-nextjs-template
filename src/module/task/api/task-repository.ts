import { eq } from "drizzle-orm"
import { db } from "@/api/db/connection"
import { tasks, type t_task, type t_new_task } from "@/module/task/api/schema/tasks"

export async function getTasksByProject(projectId: string): Promise<t_task[]> {
  return await db.select().from(tasks).where(eq(tasks.projectId, projectId))
}

export async function getTaskById(id: string): Promise<t_task | undefined> {
  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
  return result[0]
}

export async function createTask(task: t_new_task): Promise<t_task> {
  const result = await db.insert(tasks).values(task).returning()
  return result[0]
}

export async function updateTask(id: string, updates: Partial<t_new_task>): Promise<t_task> {
  const result = await db
    .update(tasks)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning()
  return result[0]
}

export async function deleteTask(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id))
}
