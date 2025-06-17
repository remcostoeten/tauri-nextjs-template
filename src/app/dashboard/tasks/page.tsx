import { getTasks } from "@/module/task/api/actions/task-actions";
import { TaskList } from "@/module/task/components/task-list";
import { db } from "@/api/db/connection";
import { projects } from "@/module/project/api/schema/project-schema";
import { eq } from "drizzle-orm";

export default async function TasksPage() {
  // Get the default project (first active project)
  const defaultProject = await db.query.projects.findFirst({
    where: eq(projects.isActive, true),
  });

  if (!defaultProject) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">No Active Project</h2>
        <p className="text-muted-foreground">Please create or activate a project to manage tasks.</p>
      </div>
    );
  }

  const initialData = await getTasks(defaultProject.id);
  return <TaskList projectId={defaultProject.id} initialData={initialData} />;
}
