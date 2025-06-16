import { Metadata } from 'next';
import { ProjectList } from '@/module/project/components/project-list';

export const metadata: Metadata = {
    title: 'Dashboard | Projects',
    description: 'Manage your projects and tasks.',
};

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8">
            <ProjectList />
        </div>
    );
} 