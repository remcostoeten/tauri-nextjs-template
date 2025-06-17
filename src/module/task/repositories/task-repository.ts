import { db } from "@/api/db/connection";
import { tasks } from "../api/schemas/task-schema";
import { taskSections } from "../api/schemas/task-section-schema";
import { eq } from "drizzle-orm";
import type { TCreateTaskData, TUpdateTaskData } from "../types/task-types";

export async function getTasks(projectId?: string) {
    try {
        console.log('Getting tasks for project:', projectId);
        const taskList = await db.select().from(tasks)
            .where(projectId ? eq(tasks.projectId, projectId) : undefined)
            .orderBy(tasks.order);
        console.log('Found tasks:', taskList);

        const sections = await db.select().from(taskSections)
            .where(projectId ? eq(taskSections.projectId, projectId) : undefined)
            .orderBy(taskSections.order);
        console.log('Found sections:', sections);

        return {
            success: true,
            tasks: taskList,
            sections,
            labels: [], // TODO: Implement labels
        };
    } catch (error) {
        console.error("Failed to get tasks:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get tasks",
        };
    }
}

export async function createTask(data: TCreateTaskData) {
    try {
        console.log('Creating task with data:', data);
        const task = await db.insert(tasks).values({
            title: data.title,
            description: data.description || null,
            priority: data.priority || "medium",
            projectId: data.projectId,
            sectionId: data.sectionId || null,
            assigneeId: data.assigneeId || null,
            order: data.order || 0,
            dueDate: data.dueDate || null,
            status: "todo",
            completedAt: null,
        }).returning();
        console.log('Created task:', task[0]);

        return {
            success: true,
            task: task[0],
        };
    } catch (error) {
        console.error("Failed to create task:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create task",
        };
    }
}

export async function updateTask(taskId: string, data: TUpdateTaskData) {
    try {
        const task = await db.update(tasks)
            .set(data)
            .where(eq(tasks.id, taskId))
            .returning();

        return {
            success: true,
            task: task[0],
        };
    } catch (error) {
        console.error("Failed to update task:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update task",
        };
    }
}

export async function deleteTask(taskId: string) {
    try {
        await db.delete(tasks).where(eq(tasks.id, taskId));
        return { success: true };
    } catch (error) {
        console.error("Failed to delete task:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete task",
        };
    }
}

export async function createTaskSection(data: { title: string; projectId: string; order: number; }) {
    try {
        const section = await db.insert(taskSections).values(data).returning();
        return {
            success: true,
            section: section[0],
        };
    } catch (error) {
        console.error("Failed to create section:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create section",
        };
    }
}

export async function updateTaskSection(sectionId: string, data: Partial<{ title: string; order: number; }>) {
    try {
        const section = await db.update(taskSections)
            .set(data)
            .where(eq(taskSections.id, sectionId))
            .returning();

        return {
            success: true,
            section: section[0],
        };
    } catch (error) {
        console.error("Failed to update section:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update section",
        };
    }
}

export async function deleteTaskSection(sectionId: string) {
    try {
        await db.delete(taskSections).where(eq(taskSections.id, sectionId));
        return { success: true };
    } catch (error) {
        console.error("Failed to delete section:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete section",
        };
    }
} 