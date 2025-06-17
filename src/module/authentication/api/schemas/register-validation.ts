import {z} from 'zod'

export const registerSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot be longer than 50 characters')
        .regex(/^[a-zA-Z0-9\s-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email cannot be longer than 255 characters')
        .toLowerCase(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password cannot be longer than 72 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});
