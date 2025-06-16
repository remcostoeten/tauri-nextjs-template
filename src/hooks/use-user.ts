'use client';

import { User } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { getSession } from '@/module/authentication/helpers/session';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await getSession();
                setUser(session);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
} 