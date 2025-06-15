'use client';

import Link from 'next/link';
import { UserNav } from './user-nav';
import { MainNav } from './main-nav';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/shared/ui/skeleton';

export function DashboardHeader() {
    const { user, loading } = useUser();

    return (
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex h-16 items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <span className="font-bold">Taskr</span>
                    </Link>
                    <MainNav />
                </div>
                <div className="flex items-center gap-4">
                    {loading ? (
                        <Skeleton className="h-4 w-[150px]" />
                    ) : user ? (
                        <span className="text-sm text-muted-foreground">
                            Welcome, {user.name || 'User'}
                        </span>
                    ) : null}
                    <UserNav />
                </div>
            </div>
        </header>
    );
} 