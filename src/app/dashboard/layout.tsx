'use client';

import { useRouter } from 'next/navigation';
import { EnterpriseSidebar } from '@/module/dashboard/components/enterprise-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen">
            <EnterpriseSidebar onNavigate={(href) => router.push(href)} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
} 