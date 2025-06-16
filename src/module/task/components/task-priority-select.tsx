"use client"

import { Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { TTaskPriority } from '@/typings/task';

const priorities: { value: TTaskPriority; label: string; icon: string }[] = [
  { value: 'urgent', label: 'Urgent', icon: '🔴' },
  { value: 'high', label: 'High', icon: '🟠' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'low', label: 'Low', icon: '🔵' },
];

const priorityColors: Record<TTaskPriority, string> = {
  urgent: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
};

interface TaskPrioritySelectProps {
  value: TTaskPriority;
  onChange: (value: TTaskPriority) => void;
  disabled?: boolean;
}

export function TaskPrioritySelect({
  value,
  onChange,
  disabled,
}: TaskPrioritySelectProps) {
  const selectedPriority = priorities.find((p) => p.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-2',
            priorityColors[value],
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Flag className="w-3 h-3" />
          {selectedPriority?.label || 'Set priority'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority.value}
            onClick={() => onChange(priority.value)}
            className={cn(
              'flex items-center gap-2',
              value === priority.value && 'bg-muted'
            )}
          >
            <span>{priority.icon}</span>
            <span className={priorityColors[priority.value]}>
              {priority.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 