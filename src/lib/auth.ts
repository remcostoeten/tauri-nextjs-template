import { db } from '@/api/db/connection';
import { users } from '@/api/db/schema';
import { eq } from 'drizzle-orm';

export type User = {
    id: string;
    email: string;
    name: string | null;
};

export type Session = {
    user: User;
};

export async function auth(): Promise<Session | null> {
    try {
        // For now, we'll use a mock session
        // TODO: Implement proper authentication
        const mockUser = await db
            .select()
            .from(users)
            .where(eq(users.email, 'admin@example.com'))
            .limit(1);

        if (!mockUser.length) {
            return null;
        }

        return {
            user: {
                id: mockUser[0].id,
                email: mockUser[0].email,
                name: mockUser[0].name,
            },
        };
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
} 