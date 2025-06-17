'use server';

import { createSession } from '@/module/authentication/helpers/session';
import { createUser, UserRegistrationError, userRepository,   } from '@/module/authentication/api/user-repository';
import { z } from 'zod';
import { registerSchema } from '../schemas/register-validation';

export async function register(formData: FormData) {
    try {
        const rawInput = {
            name: formData.get('name')?.toString().trim(),
            email: formData.get('email')?.toString().trim().toLowerCase(),
            password: formData.get('password')?.toString(),
        };

        if (!rawInput.name || !rawInput.email || !rawInput.password) {
            return {
                success: false,
                error: 'All fields are required',
            };
        }

        const validatedFields = registerSchema.parse(rawInput);

        const user = await createUser({
            name: validatedFields.name,
            email: validatedFields.email,
            password: validatedFields.password,
        });

        await createSession({
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
        });

        return {
            success: true,
            message: 'Account created successfully',
            redirect: '/dashboard',
        };
    } catch (error) {
        console.error('Register error:', error);
        if (error instanceof z.ZodError) {
            const firstError = error.errors[0];
            return {
                success: false,
                error: firstError.message,
                field: firstError.path[0].toString(),
            };
        }

        if (error instanceof UserRegistrationError) {
            return {
                success: false,
                error: error.message,
                code: error.code,
            };
        }

        console.error('Unexpected registration error:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            code: 'UNKNOWN_ERROR',
        };
    }
}
