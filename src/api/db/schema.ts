/*
 * This file is responsible for
 * re-exporting all schemas and types
 * from their respective modules
 */

// Database schemas
export * from '@/module/authentication/api/schemas';
export * from '@/module/project/api/schema/project-schema';
export * from '@/module/dashboard/api/schema/navigation-preferences-schema';
export * from '@/api/db/schema/tasks';
export { taskSections } from '@/api/db/schema/task-sections';

// Type definitions
export * from '@/typings/base';
export * from '@/typings/auth';
export * from '@/typings/task';
export * from '@/typings/project';
export * from '@/module/dashboard/types/sidebar-types';

// Zod schemas
export * from '@/schemas';

// Ensure all types are properly namespaced to avoid conflicts
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
} from '@/api/db/schema/tasks';

export type {
    TNotification,
    TNavigationItem,
    TWorkspace,
    TSpace,
    TSidebarData,
} from '@/module/dashboard/types/sidebar-types';
