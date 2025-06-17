'use client';

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
import { useProjects } from '@/module/dashboard/hooks/use-projects';
import { useState } from 'react';

export function ProjectList() {
    const {
        projects,
        createProject,
        updateProject,
        deleteProject,
        isLoading: loading,
        error,
    } = useProjects();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

    async function handleCreateProject(project: TNewProject) {
        await createProject(project);
        setShowCreateDialog(false);
    }

    async function handleUpdateProject(id: string, updates: Partial<TNewProject>) {
        await updateProject(id, updates);
        setShowEditDialog(false);
        setSelectedProject(null);
    }

    async function handleDeleteProject(id: string) {
        await deleteProject(id);
        setShowDeleteDialog(false);
        setSelectedProject(null);
    }

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
                        <CardFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedProject(project);
                                    setShowEditDialog(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedProject(project);
                                    setShowDeleteDialog(true);
                                }}
                            >
                                Delete
                            </Button>
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

            <EditProjectDialog
                open={showEditDialog}
                onOpenChange={(open) => {
                    setShowEditDialog(open);
                    if (!open) setSelectedProject(null);
                }}
                project={selectedProject}
                onUpdateProject={handleUpdateProject}
            />
            <DeleteProjectDialog
                open={showDeleteDialog}
                onOpenChange={(open) => {
                    setShowDeleteDialog(open);
                    if (!open) setSelectedProject(null);
                }}
                project={selectedProject}
                onDeleteProject={handleDeleteProject}
            />
        </div>
    );
} 