import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
    url: "libsql://learning-newton-destine-remcostoeten.aws-eu-west-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwODE1MjgsImlkIjoiZGJlMzU2ZTItOWNjOS00OGZhLWIwYTUtMDI1NTExMzIxYjYzIiwicmlkIjoiNDI3ZmMzMzMtMzI5Ni00ODgzLTg5ODQtODAxNjEzM2ZhZTFkIn0.6z8NuAxuZDR2TIGbsXVfqWnMMBJaHWrFK_L52vNakxjoAHEzcvQymZr__uT5UEBFqoPzh8Rib54tHhbGn6bPDw"
});

const db = drizzle(client, { schema });

async function main() {
    console.log("Starting migration...");
    try {
        const migrationFile = join(__dirname, 'migrations', '0000_sparkling_wallflower.sql');
        const sql = readFileSync(migrationFile, 'utf8');
        
        // Split the SQL file into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        // Execute each statement separately
        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await client.execute(statement);
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main(); 