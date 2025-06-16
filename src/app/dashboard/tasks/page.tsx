import { Metadata } from 'next';
import { TasksView } from '@/module/task/components/tasks-view';

export const metadata: Metadata = {
    title: 'Tasks | Dashboard',
    description: 'View and manage your tasks.',
};

export default function TasksPage() {
    return (
        <div className="container mx-auto py-8">
            <TasksView />
        </div>
    );
}
