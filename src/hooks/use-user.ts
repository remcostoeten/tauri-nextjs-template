'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
};

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [router]);

    return { user, loading };
} 