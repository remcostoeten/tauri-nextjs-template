import { TBaseEntity } from '@/shared/types/base';

export type TTaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TTaskSection = TBaseEntity & {
    title: string;
    projectId: string;
    order: number;
};

export type TTaskLabel = TBaseEntity & {
    name: string;
    color: string;
    projectId: string;
};

export type TTask = TBaseEntity & {
    title: string;
    description: string | null;
    status: TTaskStatus;
    priority: TTaskPriority;
    projectId: string;
    sectionId: string | null;
    assigneeId: string | null;
    order: number;
    dueDate: Date | null;
    completedAt: Date | null;
    labels?: TTaskLabel[];
};

export type TTaskComment = TBaseEntity & {
    taskId: string;
    userId: string;
    content: string;
};

export type TCreateTaskData = {
    title: string;
    description?: string;
    priority?: TTaskPriority;
    projectId: string;
    sectionId?: string;
    assigneeId?: string;
    order?: number;
    dueDate?: Date;
    labelIds?: string[];
};

export type TUpdateTaskData = Partial<{
    title: string;
    description: string;
    status: TTaskStatus;
    priority: TTaskPriority;
    sectionId: string;
    assigneeId: string;
    order: number;
    dueDate: Date;
    completedAt: Date | null;
    labelIds: string[];
}>; 