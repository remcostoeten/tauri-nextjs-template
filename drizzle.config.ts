import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
    out: './src/api/db/migrations',
    schema: './src/api/db/schema.ts',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN || '',
    },
});
