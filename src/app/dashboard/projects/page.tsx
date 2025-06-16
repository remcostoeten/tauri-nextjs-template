import { Metadata } from 'next';
import { ProjectList } from '@/module/project/components/project-list';

export const metadata: Metadata = {
    title: 'Projects | Dashboard',
    description: 'View and manage your projects.',
};

export default function ProjectsPage() {
    return (
        <div className="container mx-auto py-8">
            <ProjectList />
        </div>
    );
}
