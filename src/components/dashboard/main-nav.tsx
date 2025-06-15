'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/helpers/cn';

const items = [
    {
        title: 'Overview',
        href: '/dashboard',
    },
    {
        title: 'Tasks',
        href: '/dashboard/tasks',
    },
    {
        title: 'Projects',
        href: '/dashboard/projects',
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.href
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
} 