'use server';

import type { TCreateTaskData, TUpdateTaskData } from "../../types/task-types";
import * as taskRepository from "../../repositories/task-repository";

export async function getTasks(projectId?: string) {
    return taskRepository.getTasks(projectId);
}

export async function createTask(data: TCreateTaskData) {
    return taskRepository.createTask(data);
}

export async function updateTask(taskId: string, data: TUpdateTaskData) {
    return taskRepository.updateTask(taskId, data);
}

export async function deleteTask(taskId: string) {
    return taskRepository.deleteTask(taskId);
}

export async function createTaskSection(data: { title: string; projectId: string; order: number; }) {
    return taskRepository.createTaskSection(data);
}

export async function updateTaskSection(sectionId: string, data: Partial<{ title: string; order: number; }>) {
    return taskRepository.updateTaskSection(sectionId, data);
}

export async function deleteTaskSection(sectionId: string) {
    return taskRepository.deleteTaskSection(sectionId);
} 