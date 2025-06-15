import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Environment variable validation schema using Zod.
 * This ensures all required environment variables are present and correctly typed.
 * 
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
    server: {
        // Database Configuration
        DATABASE_URL: z
            .string()
            .url()
            .refine((str) => !str.includes("YOUR_"), {
                message: "You forgot to change the default database URL",
            }),
        DATABASE_AUTH_TOKEN: z.string().optional(),

        // Authentication Configuration
        JWT_SECRET: z
            .string()
            .min(32)
            .refine((str) => !str.includes("your_jwt_secret"), {
                message: "You forgot to change the default JWT secret",
            }),
        ADMIN_EMAIL: z
            .string()
            .email()
            .refine((str) => !str.includes("example.com"), {
                message: "You forgot to change the default admin email",
            }),

        // Node Environment
        NODE_ENV: z
            .enum(['development', 'production'])
            .default('development'),

        // OAuth Configuration
        GITHUB_CLIENT_ID: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default GitHub client ID",
            }),
        GITHUB_CLIENT_SECRET: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default GitHub client secret",
            }),

        GOOGLE_CLIENT_ID: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default Google client ID",
            }),
        GOOGLE_CLIENT_SECRET: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default Google client secret",
            }),
        DISCORD_CLIENT_ID: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default Discord client ID",
            }),
        DISCORD_CLIENT_SECRET: z
            .string()
            .min(1)
            .refine((str) => !str.includes("your_"), {
                message: "You forgot to change the default Discord client secret",
            }),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z
            .string()
            .url()
            .refine((str) => !str.includes("example.com"), {
                message: "You forgot to change the default app URL",
            }),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
        JWT_SECRET: process.env.JWT_SECRET,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        NODE_ENV: process.env.NODE_ENV,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    /**
     * Skip validation only in development when explicitly set
     * This should NEVER be skipped in production
     */
    skipValidation: process.env.NODE_ENV !== 'production' && !!process.env.SKIP_ENV_VALIDATION,
});