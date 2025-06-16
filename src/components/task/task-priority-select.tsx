import { Flag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { type TTaskPriority } from '@/typings/task';

const priorities: { value: TTaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-blue-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
];

type TaskPrioritySelectProps = {
  value: TTaskPriority;
  onChange: (value: TTaskPriority) => void;
};

export function TaskPrioritySelect({ value, onChange }: TaskPrioritySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        {priorities.map((priority) => (
          <SelectItem key={priority.value} value={priority.value}>
            <div className="flex items-center gap-2">
              <Flag className={`h-4 w-4 ${priority.color}`} />
              <span>{priority.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 