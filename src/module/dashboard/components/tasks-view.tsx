'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronRight,
  Circle,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  MoreVertical,
  Tag,
  Trash2,
  Edit,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { TTaskPriority, TTaskSection, TTaskLabel } from '@/typings/task';
import { useTasks } from '@/hooks/use-tasks';
import { TaskPrioritySelect } from '@/components/task/task-priority-select';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Badge } from '@/shared/ui/badge';
import { ScrollArea } from '@/shared/ui/scroll-area';

const priorityColors: Record<TTaskPriority, string> = {
  low: 'bg-blue-500/10 text-blue-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-red-500/10 text-red-500',
};

type TasksViewProps = {
  projectId?: string;
  defaultSection?: string;
};

export function TasksView({ projectId, defaultSection }: TasksViewProps) {
  const {
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
  } = useTasks(projectId);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(defaultSection || null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (sectionId?: string | null) => {
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        title: newTaskTitle,
        projectId: projectId || '',
        priority: 'medium',
        sectionId: sectionId || undefined,
      });
      setNewTaskTitle('');
      toast.success('Task created');
    } catch (err) {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;

    try {
      await createSection({
        title: newSectionTitle,
        projectId: projectId || '',
      });
      setNewSectionTitle('');
      toast.success('Section created');
    } catch (err) {
      toast.error('Failed to create section. Please try again.');
    }
  };

  const handleUpdateSection = async (sectionId: string, title: string) => {
    try {
      await updateSection(sectionId, { title });
      setEditingSection(null);
      toast.success('Section updated');
    } catch (err) {
      toast.error('Failed to update section. Please try again.');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection(sectionId);
      toast.success('Section deleted');
    } catch (err) {
      toast.error('Failed to delete section. Please try again.');
    }
  };

  const renderTaskList = (sectionId?: string) => {
    const sectionTasks = tasks.filter((task) => task.sectionId === sectionId);

    return (
      <AnimatePresence>
        {sectionTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'group relative flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
              expandedTask === task.id && 'bg-muted'
            )}
          >
            {/* Task Status */}
            <button
              onClick={() => toggleTaskCompletion(task.id)}
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
                      'w-4 h-4 transition-transform',
                      expandedTask === task.id && 'rotate-90'
                    )}
                  />
                  <span
                    className={cn(task.status === 'completed' && 'line-through text-muted-foreground')}
                  >
                    {task.title}
                  </span>
                </button>

                {/* Task Metadata */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {task.labels?.map((label) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      style={{ backgroundColor: `${label.color}20`, color: label.color }}
                      className="h-5 text-xs"
                    >
                      {label.name}
                    </Badge>
                  ))}
                  {task.dueDate && (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className={cn('px-1.5 py-0.5 rounded-full text-xs font-medium', priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                </div>

                {/* Task Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setExpandedTask(task.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="mr-2 h-4 w-4" />
                      Add Label
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error.message || 'An error occurred while loading tasks'}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewSectionTitle('')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add View
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tasks without sections */}
            <div className="space-y-1">
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
                <Button onClick={() => handleAddTask()}>Add Task</Button>
              </div>

              {renderTaskList(undefined)}
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  {editingSection === section.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateSection(section.id, newSectionTitle);
                          } else if (e.key === 'Escape') {
                            setEditingSection(null);
                          }
                        }}
                        className="h-7 py-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateSection(section.id, newSectionTitle)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingSection(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <ChevronRight
                        className={cn(
                          'w-4 h-4 transition-transform',
                          expandedSection === section.id && 'rotate-90'
                        )}
                      />
                      {section.title}
                    </button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingSection(section.id);
                          setNewSectionTitle(section.title);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {expandedSection === section.id && (
                  <div className="pl-6 mt-2">
                    {/* Section Quick Add Task */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="Add a task..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask(section.id)}
                          className="pl-10"
                        />
                        <Plus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <Button onClick={() => handleAddTask(section.id)}>Add Task</Button>
                    </div>

                    {renderTaskList(section.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
} 