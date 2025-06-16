"use client"

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Circle, CheckCircle2, Clock, Flag, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { TTaskPriority } from '@/typings/task';
import { useTasks } from '../hooks/use-tasks';
import { TaskPrioritySelect } from './task-priority-select';
import { toast } from '@/shared/ui';

const priorityColors: Record<TTaskPriority, string> = {
  low: 'bg-blue-500/10 text-blue-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-red-500/10 text-red-500'
};

export function TasksView({ projectId }: { projectId?: string }) {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    toggleTaskCompletion,
    updateTask
  } = useTasks(projectId);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      await createTask({
        title: newTaskTitle,
        projectId: projectId || '', // Handle this better based on your project context
        priority: 'medium'
      });
      setNewTaskTitle('');
      toast.success('Task created');
    } catch (err) {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (err) {
      toast.error('Failed to update task status. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={fetchTasks} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add View
        </Button>
      </div>

      {/* Quick Add Task */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="pl-10"
          />
          <Plus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>

      {/* Task List */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "group relative flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-muted/50",
                  expandedTask === task.id && "bg-muted"
                )}
              >
                {/* Task Status */}
                <button
                  onClick={() => handleToggleCompletion(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Task Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="flex items-center gap-2 text-sm font-medium leading-none"
                    >
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          expandedTask === task.id && "rotate-90"
                        )}
                      />
                      <span className={cn(
                        task.status === 'completed' && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </span>
                    </button>

                    {/* Task Metadata */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {task.dueDate && (
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-xs font-medium",
                        priorityColors[task.priority]
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Task Details */}
                  <AnimatePresence>
                    {expandedTask === task.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 text-sm text-muted-foreground"
                      >
                        {task.description || 'No description'}
                        
                        {/* Quick Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Clock className="w-3 h-3 mr-1" />
                            Set due date
                          </Button>
                          <TaskPrioritySelect
                            value={task.priority}
                            onChange={async (newPriority) => {
                              try {
                                await updateTask(task.id, { priority: newPriority });
                                toast.success(`Task priority updated to ${newPriority}`);
                              } catch (err) {
                                toast.error('Failed to update task priority');
                              }
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
