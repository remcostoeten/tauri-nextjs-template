import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/api/db/connection';
import { tasks, projects } from '@/api/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const createTaskSchema = z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'completed', 'archived']).default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    projectId: z.string().uuid('Invalid project ID'),
    assigneeId: z.string().uuid('Invalid assignee ID').optional(),
    dueDate: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        // Verify project access
        if (projectId) {
            const project = await db
                .select()
                .from(projects)
                .where(eq(projects.id, projectId))
                .limit(1);

            if (!project.length || project[0].ownerId !== session.user.id) {
                return NextResponse.json(
                    { error: 'Project not found or unauthorized' },
                    { status: 404 }
                );
            }

            const projectTasks = await db
                .select()
                .from(tasks)
                .where(eq(tasks.projectId, projectId));

            return NextResponse.json(projectTasks);
        }

        // Return all tasks from user's projects
        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.ownerId, session.user.id));

        if (userProjects.length === 0) {
            return NextResponse.json([]);
        }

        const allTasks = await Promise.all(
            userProjects.map(project =>
                db
                    .select()
                    .from(tasks)
                    .where(eq(tasks.projectId, project.id))
            )
        );

        return NextResponse.json(allTasks.flat());
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = createTaskSchema.parse(body);

        // Verify project access
        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, validatedData.projectId))
            .limit(1);

        if (!project.length || project[0].ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Project not found or unauthorized' },
                { status: 404 }
            );
        }

        const newTask = await db
            .insert(tasks)
            .values({
                title: validatedData.title,
                description: validatedData.description,
                status: validatedData.status,
                priority: validatedData.priority,
                projectId: validatedData.projectId,
                assigneeId: validatedData.assigneeId,
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
            })
            .returning();

        return NextResponse.json(newTask[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid task data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Failed to create task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        // Verify task access
        const task = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, id))
            .limit(1);

        if (!task.length) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Verify project access
        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, task[0].projectId))
            .limit(1);

        if (!project.length || project[0].ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const validatedData = createTaskSchema.partial().parse(updateData);

        const updatedTask = await db
            .update(tasks)
            .set({
                ...validatedData,
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
                updatedAt: new Date(),
            })
            .where(eq(tasks.id, id))
            .returning();

        return NextResponse.json(updatedTask[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid task data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Failed to update task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        // Verify task access
        const task = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, id))
            .limit(1);

        if (!task.length) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Verify project access
        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, task[0].projectId))
            .limit(1);

        if (!project.length || project[0].ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const deletedTask = await db
            .delete(tasks)
            .where(eq(tasks.id, id))
            .returning();

        return NextResponse.json(deletedTask[0]);
    } catch (error) {
        console.error('Failed to delete task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
} 