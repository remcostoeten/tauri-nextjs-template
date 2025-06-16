'use client';

import { useEffect, useState } from 'react';
import { TProject, TNewProject } from '@/module/project/api/schema/project-schema';
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
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

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

    async function handleCreateProject(project: TNewProject) {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
            await fetchProjects();
        } catch (error) {
            toast.error('Failed to create project');
            throw error;
        }
    }

    async function handleUpdateProject(id: string, updates: Partial<TNewProject>) {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error('Failed to update project');
            }
            await fetchProjects();
        } catch (error) {
            toast.error('Failed to update project');
            throw error;
        }
    }

    async function handleDeleteProject(id: string) {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            await fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
            throw error;
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
                <CreateProjectDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onCreateProject={handleCreateProject}
                />
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
                                open={showEditDialog && selectedProject?.id === project.id}
                                onOpenChange={(open) => {
                                    setShowEditDialog(open);
                                    if (!open) setSelectedProject(null);
                                }}
                                project={project}
                                onUpdateProject={handleUpdateProject}
                            />
                            <DeleteProjectDialog
                                open={showDeleteDialog && selectedProject?.id === project.id}
                                onOpenChange={(open) => {
                                    setShowDeleteDialog(open);
                                    if (!open) setSelectedProject(null);
                                }}
                                project={project}
                                onDeleteProject={handleDeleteProject}
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