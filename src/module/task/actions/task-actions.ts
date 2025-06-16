'use server';

import { db } from '@/api/db/connection';
import { tasks, taskSections, taskLabels, taskLabelAssignments } from '@/module/task/api/schemas/tasks';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { TCreateTaskData, TUpdateTaskData } from '@/typings/task';

export async function getTasks(projectId?: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    if (projectId) {
        return await db
            .select()
            .from(tasks)
            .where(eq(tasks.projectId, projectId))
            .orderBy(tasks.order);
    }

    return await db
        .select()
        .from(tasks)
        .orderBy(tasks.order);
}

export async function createTask(data: TCreateTaskData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const task = await db
        .insert(tasks)
        .values({
            title: data.title,
            description: data.description || null,
            projectId: data.projectId,
            sectionId: data.sectionId || null,
            priority: data.priority || 'medium',
            assigneeId: data.assigneeId || null,
            order: data.order || 0,
            dueDate: data.dueDate || null,
        })
        .returning();

    // If labels are provided, create the assignments
    if (data.labelIds?.length) {
        await db.insert(taskLabelAssignments).values(
            data.labelIds.map(labelId => ({
                taskId: task[0].id,
                labelId,
            }))
        );
    }

    revalidatePath('/dashboard/tasks');
    return task[0];
}

export async function updateTask(taskId: string, data: TUpdateTaskData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const task = await db
        .update(tasks)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();

    // Update label assignments if provided
    if (data.labelIds) {
        // Remove existing assignments
        await db
            .delete(taskLabelAssignments)
            .where(eq(taskLabelAssignments.taskId, taskId));

        // Add new assignments
        if (data.labelIds.length) {
            await db.insert(taskLabelAssignments).values(
                data.labelIds.map(labelId => ({
                    taskId,
                    labelId,
                }))
            );
        }
    }

    revalidatePath('/dashboard/tasks');
    return task[0];
}

export async function deleteTask(taskId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const task = await db
        .delete(tasks)
        .where(eq(tasks.id, taskId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return task[0];
}

export async function reorderTask(taskId: string, newOrder: number, newSectionId?: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const task = await db
        .update(tasks)
        .set({
            order: newOrder,
            sectionId: newSectionId,
            updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return task[0];
}

export async function toggleTaskCompletion(taskId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const existingTask = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

    if (!existingTask.length) {
        throw new Error('Task not found');
    }

    const isCompleting = existingTask[0].status !== 'completed';
    const task = await db
        .update(tasks)
        .set({
            status: isCompleting ? 'completed' : 'todo',
            completedAt: isCompleting ? new Date() : null,
            updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return task[0];
} 