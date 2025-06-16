'use client';

import { useEffect, useState } from 'react';
import { TProject } from '@/typings/project';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { CreateProjectDialog } from './create-project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';
import { toast } from '@/shared/ui';

export function ProjectList() {
    const [projects, setProjects] = useState<TProject[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchProjects() {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            toast.warning('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Projects</h2>
                <CreateProjectDialog onProjectCreated={fetchProjects} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Status: {project.status}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <EditProjectDialog
                                project={project}
                                onProjectUpdated={fetchProjects}
                            />
                            <DeleteProjectDialog
                                project={project}
                                onProjectDeleted={fetchProjects}
                            />
                            <Button variant="outline" asChild>
                                <a href={`/dashboard/projects/${project.id}`}>
                                    View Details
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {projects.length === 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Projects</CardTitle>
                            <CardDescription>
                                Create your first project to get started.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
} 