import { useState, useCallback } from 'react';
import { type TTask, type TTaskSection, type TTaskLabel } from '@/typings/task';

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [sections, setSections] = useState<TTaskSection[]>([]);
  const [labels, setLabels] = useState<TTaskLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks${projectId ? `?projectId=${projectId}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks);
      setSections(data.sections);
      setLabels(data.labels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createTask = useCallback(async (taskData: Partial<TTask>) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    const data = await response.json();
    setTasks((prev) => [...prev, data.task]);
    return data.task;
  }, []);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error('Failed to update task');
    
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, [tasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<TTask>) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    const data = await response.json();
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...data.task } : t))
    );
    return data.task;
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const createSection = useCallback(async (sectionData: Partial<TTaskSection>) => {
    const response = await fetch('/api/task-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionData),
    });
    if (!response.ok) throw new Error('Failed to create section');
    const data = await response.json();
    setSections((prev) => [...prev, data.section]);
    return data.section;
  }, []);

  const updateSection = useCallback(async (sectionId: string, updates: Partial<TTaskSection>) => {
    const response = await fetch(`/api/task-sections/${sectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update section');
    const data = await response.json();
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...data.section } : s))
    );
    return data.section;
  }, []);

  const deleteSection = useCallback(async (sectionId: string) => {
    const response = await fetch(`/api/task-sections/${sectionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete section');
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  return {
    tasks,
    sections,
    labels,
    isLoading,
    error,
    fetchTasks,
    createTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    createSection,
    updateSection,
    deleteSection,
  };
} 