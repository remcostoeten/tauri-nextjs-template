/*
 * This file is responsible for
 * re-exporting all schemas and types
 * from their respective modules
 */

// Database schemas
export * from '@/module/authentication/api/schemas';
export * from '@/module/projects/api/schema/project-schema';
export * from '@/module/dashboard/api/schema/navigation-preferences-schema';
export * from '@/module/task/api/schemas/tasks';

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
    t_project,
    t_new_project,
} from '@/module/projects/api/schema/project-schema';

export type {
    t_navigation_preference,
    t_new_navigation_preference,
} from '@/module/dashboard/api/schema/navigation-preferences-schema';

export type {
    t_task,
    t_new_task,
} from '@/module/task/api/schemas/tasks';

export type {
    t_notification,
    t_navigation_item,
    t_workspace,
    t_space,
    t_sidebar_data,
} from '@/module/dashboard/types/sidebar-types';
