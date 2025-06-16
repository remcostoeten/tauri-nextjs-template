'use server';

import { db } from '@/api/db/connection';
import { taskSections } from '@/module/task/api/schemas/tasks';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { TTaskSection } from '@/typings/task';

export async function getSections(projectId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    return await db
        .select()
        .from(taskSections)
        .where(eq(taskSections.projectId, projectId))
        .orderBy(taskSections.order);
}

export async function createSection(data: Omit<TTaskSection, 'id' | 'createdAt' | 'updatedAt'>) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const section = await db
        .insert(taskSections)
        .values(data)
        .returning();

    revalidatePath('/dashboard/tasks');
    return section[0];
}

export async function updateSection(sectionId: string, data: Partial<Omit<TTaskSection, 'id' | 'createdAt' | 'updatedAt'>>) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const section = await db
        .update(taskSections)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(taskSections.id, sectionId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return section[0];
}

export async function deleteSection(sectionId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const section = await db
        .delete(taskSections)
        .where(eq(taskSections.id, sectionId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return section[0];
}

export async function reorderSection(sectionId: string, newOrder: number) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const section = await db
        .update(taskSections)
        .set({
            order: newOrder,
            updatedAt: new Date(),
        })
        .where(eq(taskSections.id, sectionId))
        .returning();

    revalidatePath('/dashboard/tasks');
    return section[0];
} 