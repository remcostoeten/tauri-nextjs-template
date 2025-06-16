'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { signOut } from 'next-auth/react';
import { Skeleton } from '@/shared/ui/skeleton';
import { SidebarMenuItem, SidebarMenuButton } from '@/shared/ui/sidebar';
import { Settings, LogOut, User as UserIcon } from 'lucide-react';

export function SidebarUserMenu() {
    const router = useRouter();
    const { user, loading } = useUser();

    if (loading) {
        return (
            <SidebarMenuItem>
                <div className="flex items-center gap-3 px-3 py-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col flex-1 gap-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </SidebarMenuItem>
        );
    }

    if (!user) {
        return null;
    }

    const initials = user.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : user.email[0].toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton asChild className="w-full px-3 py-2 hover:bg-[#2a2a2a]">
                    <button className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || ''} alt={user.name || 'User'} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-white">
                                {user.name || 'User'}
                            </span>
                            <span className="text-xs text-[#b4b4b4] truncate max-w-[150px]">
                                {user.email}
                            </span>
                        </div>
                    </button>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 