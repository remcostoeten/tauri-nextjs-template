import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/api/db/connection';
import { projects } from '@/api/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    status: z.enum(['active', 'completed', 'archived']).default('active'),
});

export async function GET() {
    try {
        const allProjects = await db.select().from(projects);
        return NextResponse.json(allProjects);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
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
        const validatedData = createProjectSchema.parse(body);

        const newProject = await db
            .insert(projects)
            .values({
                name: validatedData.name,
                description: validatedData.description,
                status: validatedData.status,
                ownerId: session.user.id,
            })
            .returning();

        return NextResponse.json(newProject[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid project data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Failed to create project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
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
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Verify project ownership
        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1);

        if (!project.length || project[0].ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Project not found or unauthorized' },
                { status: 404 }
            );
        }

        const validatedData = createProjectSchema.partial().parse(updateData);

        const updatedProject = await db
            .update(projects)
            .set({
                ...validatedData,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, id))
            .returning();

        return NextResponse.json(updatedProject[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid project data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Failed to update project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
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
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Verify project ownership
        const project = await db
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1);

        if (!project.length || project[0].ownerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Project not found or unauthorized' },
                { status: 404 }
            );
        }

        const deletedProject = await db
            .delete(projects)
            .where(eq(projects.id, id))
            .returning();

        return NextResponse.json(deletedProject[0]);
    } catch (error) {
        console.error('Failed to delete project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
} 