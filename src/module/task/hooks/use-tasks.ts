"use client"

import { useEffect, useCallback, useMemo } from 'react';
import { type TTask, type TTaskSection, type TTaskLabel, type TCreateTaskData, type TUpdateTaskData } from '../types/task-types';
import { getTasks, createTask as createTaskAction, updateTask as updateTaskAction, deleteTask as deleteTaskAction } from '../api/actions/task-actions';
import { useCrudFactory } from '@/shared/hooks/use-crud-factory';
import { useTaskSections } from '@/module/task/hooks/use-task-sections';

type TInitialData = Awaited<ReturnType<typeof getTasks>>;

export function useTasks(projectId?: string, initialData?: TInitialData) {
    const taskOperations = useMemo(() => ({
        getAll: async () => {
            const result = await getTasks(projectId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.tasks as TTask[];
        },
        create: async (taskData: TCreateTaskData) => {
            const result = await createTaskAction(taskData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.task as TTask;
        },
        update: async (taskId: string, updates: TUpdateTaskData) => {
            const result = await updateTaskAction(taskId, updates);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.task as TTask;
        },
        delete: async (taskId: string) => {
            const result = await deleteTaskAction(taskId);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    }), [projectId]);

    const crud = useCrudFactory<TTask, TCreateTaskData>(taskOperations);
    const { sections, labels } = useTaskSections(projectId, initialData);

    const loadItems = useCallback(() => {
        if (!initialData) {
            crud.loadItems();
        }
    }, [crud.loadItems, initialData]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const toggleTaskCompletion = useCallback(async (taskId: string) => {
        const task = crud.items.find((t) => t.id === taskId);
        if (!task) return;

        await crud.updateItem(taskId, {
            status: task.status === 'completed' ? 'todo' : 'completed',
            completedAt: task.status === 'completed' ? null : new Date(),
        } as TUpdateTaskData);
    }, [crud.items, crud.updateItem]);

    return {
        tasks: crud.items,
        sections,
        labels,
        isLoading: crud.isLoading,
        error: crud.error,
        fetchTasks: crud.loadItems,
        createTask: crud.createItem,
        toggleTaskCompletion,
        updateTask: crud.updateItem,
        deleteTask: crud.deleteItem,
    };
} 