'use server';

import { db } from '@/api/db/connection';
import { taskLabels, taskLabelAssignments } from '@/module/task/api/schemas/tasks';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { TTaskLabel } from '@/typings/task';

export async function getLabels(projectId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    return await db
        .select()
        .from(taskLabels)
        .where(eq(taskLabels.projectId, projectId));
}

export async function getTaskLabels(taskId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const assignments = await db
        .select({
            label: taskLabels,
        })
        .from(taskLabelAssignments)
        .innerJoin(taskLabels, eq(taskLabelAssignments.labelId, taskLabels.id))
        .where(eq(taskLabelAssignments.taskId, taskId));

    return assignments.map(a => a.label);
}

export async function createLabel(data: Omit<TTaskLabel, 'id' | 'createdAt' | 'updatedAt'>) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const label = await db
        .insert(taskLabels)
        .values(data)
        .returning();

    revalidatePath('/dashboard/tasks');
    return label[0];
}

export async function updateLabel(labelId: string, data: Partial<Omit<TTaskLabel, 'id' | 'createdAt' | 'updatedAt'>>) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const label = await db
        .update(taskLabels)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(taskLabels.id, labelId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return label[0];
}

export async function deleteLabel(labelId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const label = await db
        .delete(taskLabels)
        .where(eq(taskLabels.id, labelId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return label[0];
}

export async function assignLabelToTask(taskId: string, labelId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    await db
        .insert(taskLabelAssignments)
        .values({
            taskId,
            labelId,
        })
        .onConflictDoNothing();

    revalidatePath('/dashboard/tasks');
}

export async function removeLabelFromTask(taskId: string, labelId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    await db
        .delete(taskLabelAssignments)
        .where(
            and(
                eq(taskLabelAssignments.taskId, taskId),
                eq(taskLabelAssignments.labelId, labelId)
            )
        );

    revalidatePath('/dashboard/tasks');
} 