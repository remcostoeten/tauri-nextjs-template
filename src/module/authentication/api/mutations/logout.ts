'use server';

import { destroySession } from '@/module/authentication/helpers/session';
import { redirect } from 'next/navigation';

export async function logout(clearRememberMe: boolean = false) {
    try {
        // Destroy the server session
        await destroySession();
        
        // Return success with flag to clear remember me on client side
        return {
            success: true,
            clearRememberMe,
            message: 'Logged out successfully'
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Failed to logout'
        };
    }
}
