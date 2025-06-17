import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { projects } from "./schema";

const client = createClient({
    url: 'libsql://rare-aquagirl-remcostoeten.aws-eu-west-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAxODcyMTUsImlkIjoiY2IyOTUxMWUtMGI2NS00NjMxLWFkMGUtMWNiMDEzZTY0NGIwIiwicmlkIjoiMjRhYWQyNWEtODNkOS00ZmJiLWEzYWYtODJlODA3NDNlY2NjIn0.i3VDSSHtqSmJS3N0KkBS06esGsKe-WL-c7zeeVBXVD8a94EnTa3OdePr4n-s3lPYmRcPSVFiJmazBm0X0Y6DCA'
});

const db = drizzle(client, { schema: { projects } });

async function seed() {
    console.log("Seeding database...");
    try {
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