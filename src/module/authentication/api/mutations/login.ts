'use server';

import { createSession } from '@/module/authentication/helpers/session';
import { userRepository } from '../user-repository';
import { TAuthMutationResponse } from '@/typings/auth';

export async function login(formData: FormData): Promise<TAuthMutationResponse> {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        return {
            success: false,
            error: 'Missing credentials',
        };
    }

    try {
        const user = await userRepository().validateCredentials(email, password);
        if (!user) {
            return {
                success: false,
                error: 'Invalid credentials',
            };
        }

        await createSession({
            id: user.id,
            email: user.email,
            ...(user.name && { name: user.name }),
        });

        return {
            success: true,
            user,
            message: 'Logged in successfully',
            redirect: '/dashboard',
        };
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }
        return {
            success: false,
            error: 'An unexpected error occurred',
        };
    }
}
