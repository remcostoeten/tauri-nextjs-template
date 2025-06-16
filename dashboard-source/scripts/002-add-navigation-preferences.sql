-- Create navigation preferences table
CREATE TABLE IF NOT EXISTS navigation_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  position INTEGER NOT NULL,
  custom_label VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, item_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_navigation_preferences_project_id ON navigation_preferences(project_id);
CREATE INDEX IF NOT EXISTS idx_navigation_preferences_position ON navigation_preferences(project_id, position);
