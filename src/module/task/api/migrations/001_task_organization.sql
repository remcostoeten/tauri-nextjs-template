-- Create task sections table
CREATE TABLE IF NOT EXISTS task_sections (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create task labels table
CREATE TABLE IF NOT EXISTS task_labels (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create task label assignments table
CREATE TABLE IF NOT EXISTS task_label_assignments (
    id TEXT PRIMARY KEY NOT NULL,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id TEXT NOT NULL REFERENCES task_labels(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    UNIQUE(task_id, label_id)
);

-- Add section_id and order to tasks table
ALTER TABLE tasks
ADD COLUMN section_id TEXT REFERENCES task_sections(id) ON DELETE SET NULL;
ALTER TABLE tasks
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_task_sections_project_id ON task_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_task_labels_project_id ON task_labels(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_section_id ON tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_task_label_assignments_task_id ON task_label_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_label_assignments_label_id ON task_label_assignments(label_id); 