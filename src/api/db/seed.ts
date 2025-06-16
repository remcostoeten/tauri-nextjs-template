import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { projects } from "./schema";

const client = createClient({
    url: "libsql://learning-newton-destine-remcostoeten.aws-eu-west-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwODE1MjgsImlkIjoiZGJlMzU2ZTItOWNjOS00OGZhLWIwYTUtMDI1NTExMzIxYjYzIiwicmlkIjoiNDI3ZmMzMzMtMzI5Ni00ODgzLTg5ODQtODAxNjEzM2ZhZTFkIn0.6z8NuAxuZDR2TIGbsXVfqWnMMBJaHWrFK_L52vNakxjoAHEzcvQymZr__uT5UEBFqoPzh8Rib54tHhbGn6bPDw"
});

const db = drizzle(client, { schema: { projects } });

async function seed() {
    console.log("Seeding database...");
    try {
        // Insert a default project
        await db.insert(projects).values({
            name: "Default Project",
            description: "This is the default project",
            color: "#f76808",
            icon: "Folder",
            isActive: true,
        });
        
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.close();
    }
}

seed(); 