"use client"

import { useEffect, useCallback, useMemo } from 'react';
import { type TTaskSection, type TTaskLabel } from '../types/task-types';
import { getTasks, createTaskSection, updateTaskSection, deleteTaskSection } from '../api/actions/task-actions';
import { useCrudFactory } from '@/shared/hooks/use-crud-factory';

type TInitialData = Awaited<ReturnType<typeof getTasks>>;
type TCreateTaskSectionData = Pick<TTaskSection, 'title' | 'projectId' | 'order'>;
type TUpdateTaskSectionData = Partial<Pick<TTaskSection, 'title' | 'order'>>;

export function useTaskSections(projectId?: string, initialData?: TInitialData) {
    const sectionOperations = useMemo(() => ({
        getAll: async () => {
            const result = await getTasks(projectId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return (result.sections || []) as TTaskSection[];
        },
        create: async (sectionData: TCreateTaskSectionData) => {
            const result = await createTaskSection(sectionData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.section as TTaskSection;
        },
        update: async (sectionId: string, updates: TUpdateTaskSectionData) => {
            const result = await updateTaskSection(sectionId, updates);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.section as TTaskSection;
        },
        delete: async (sectionId: string) => {
            const result = await deleteTaskSection(sectionId);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    }), [projectId]);

    const crud = useCrudFactory<TTaskSection, TCreateTaskSectionData>(sectionOperations);
    const labels = useMemo(() =>
        initialData?.success ? initialData.labels as TTaskLabel[] : []
        , [initialData]);

    const loadItems = useCallback(() => {
        if (!initialData) {
            crud.loadItems();
        }
    }, [crud.loadItems, initialData]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    return {
        sections: crud.items,
        labels,
        isLoading: crud.isLoading,
        error: crud.error,
        createSection: crud.createItem,
        updateSection: crud.updateItem,
        deleteSection: crud.deleteItem,
    };
} 