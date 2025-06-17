/*
 * This file is responsible for
 * re-exporting all schemas and types
 * from their respective modules
 */

// Database schemas
export * from '@/module/authentication/api/schemas';
export * from '@/module/project/api/schema/project-schema';
export * from '@/module/dashboard/api/schema/navigation-preferences-schema';
export * from '@/module/task/api/schemas/task-schema';
export * from '@/module/task/api/schemas/task-section-schema';

export * from '@/shared/types/base';
export * from '@/typings/auth';
export * from '@/typings/task';
export * from '@/typings/project';
export * from '@/module/dashboard/types/sidebar-types';

export * from '@/schemas';

export type {
    TProject,
    TNewProject,
} from '@/module/project/api/schema/project-schema';

export type {
    TNavigationPreference,
    TNewNavigationPreference,
} from '@/module/dashboard/api/schema/navigation-preferences-schema';

export type {
    TTask,
    TNewTask,
} from '@/module/task/api/schemas/task-schema';

export type {
    TTaskSection,
    TNewTaskSection,
} from '@/module/task/api/schemas/task-section-schema';

export type {
    TNotification,
    TNavigationItem,
    TWorkspace,
    TSpace,
    TSidebarData,
} from '@/module/dashboard/types/sidebar-types';
