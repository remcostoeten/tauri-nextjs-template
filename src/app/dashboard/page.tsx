import { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardOverview } from '@/components/dashboard/overview';

export const metadata: Metadata = {
    title: 'Dashboard | Taskr',
    description: 'Manage your tasks and projects efficiently.',
};

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <DashboardHeader />
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <nav className="grid items-start gap-4">
                        <h2 className="text-lg font-semibold">Dashboard</h2>
                        {/* Add navigation items here */}
                    </nav>
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    <DashboardOverview />
                </main>
            </div>
        </div>
    );
} 