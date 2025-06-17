import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Clock,
    Calendar,
    AlignLeft,
    Tag,
    User,
    Flag,
    MessageSquare,
    Link as LinkIcon,
    Paperclip,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { TaskPrioritySelect } from './task-priority-select'
import { TTask, TTaskPriority, TUpdateTaskData } from '@/typings/task'
import { cn } from '@/shared/lib/utils'
import { DatePicker } from '@/shared/ui/date-picker'
import { toast } from 'sonner'
import { Separator } from '@/shared/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

type ExpandedTaskViewProps = {
    task: TTask
    onUpdate: (taskId: string, updates: TUpdateTaskData) => Promise<TTask>
}

export function ExpandedTaskView({ task, onUpdate }: ExpandedTaskViewProps) {
    const [description, setDescription] = useState(task.description || '')
    const [isEditingDescription, setIsEditingDescription] = useState(false)

    const handleUpdateDescription = async () => {
        try {
            await onUpdate(task.id, { description })
            setIsEditingDescription(false)
            toast.success('Description updated')
        } catch (err) {
            toast.error('Failed to update description')
        }
    }

    const handleUpdateDueDate = async (date: Date | undefined) => {
        try {
            await onUpdate(task.id, { dueDate: date })
            toast.success('Due date updated')
        } catch (err) {
            toast.error('Failed to update due date')
        }
    }

    const handleUpdatePriority = async (priority: TTaskPriority) => {
        try {
            await onUpdate(task.id, { priority })
            toast.success(`Priority updated to ${priority}`)
        } catch (err) {
            toast.error('Failed to update priority')
        }
    }

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-4"
        >
            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
                <DatePicker date={task.dueDate} onSelect={handleUpdateDueDate}>
                    <Button variant="outline" size="sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Set due date'}
                    </Button>
                </DatePicker>

                <TaskPrioritySelect value={task.priority} onChange={handleUpdatePriority} />

                <Button variant="outline" size="sm">
                    <User className="w-3 h-3 mr-1" />
                    Assign
                </Button>

                <Button variant="outline" size="sm">
                    <Tag className="w-3 h-3 mr-1" />
                    Add Label
                </Button>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlignLeft className="w-4 h-4" />
                        <span>Description</span>
                    </div>
                    {!isEditingDescription && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(true)}>
                            Edit
                        </Button>
                    )}
                </div>

                {isEditingDescription ? (
                    <div className="space-y-2">
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsEditingDescription(false)
                                    setDescription(task.description || '')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateDescription}>
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'text-sm rounded-lg p-2 min-h-[2.5rem]',
                            description ? 'bg-muted' : 'border border-dashed'
                        )}
                        onClick={() => setIsEditingDescription(true)}
                    >
                        {description || 'Add a description...'}
                    </div>
                )}
            </div>

            <Separator />

            {/* Activity */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>Activity</span>
                </div>

                <div className="space-y-4">
                    {/* Comment Input */}
                    <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea placeholder="Write a comment..." className="min-h-[80px]" />
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Paperclip className="w-3 h-3 mr-1" />
                                        Attach
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <LinkIcon className="w-3 h-3 mr-1" />
                                        Link
                                    </Button>
                                </div>
                                <Button size="sm">Comment</Button>
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src="" />
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-muted rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">System</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(task.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">Task created</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 