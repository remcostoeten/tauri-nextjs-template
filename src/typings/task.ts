import { TBaseEntity } from './base';

export type TTaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TTask = TBaseEntity & {
    title: string;
    description: string | null;
    status: TTaskStatus;
    priority: TTaskPriority;
    projectId: string;
    assigneeId: string | null;
    dueDate: Date | null;
    completedAt: Date | null;
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
    assigneeId?: string;
    dueDate?: Date;
};

export type TUpdateTaskData = Partial<{
    title: string;
    description: string;
    status: TTaskStatus;
    priority: TTaskPriority;
    assigneeId: string;
    dueDate: Date;
}>; 