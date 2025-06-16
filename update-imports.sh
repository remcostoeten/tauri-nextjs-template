#!/bin/bash

# Function to update imports in a file
update_imports() {
    local file=$1
    
    # Update UI component imports
    sed -i 's|@/components/ui/|@/shared/ui/|g' "$file"
    
    # Update hook imports
    sed -i 's|@/hooks/|@/shared/hooks/|g' "$file"
    
    # Update project-specific imports
    sed -i 's|@/components/project/|@/module/project/components/|g' "$file"
    
    # Update task-specific imports
    sed -i 's|@/components/task/|@/module/task/components/|g' "$file"
    
    # Update dashboard-specific imports
    sed -i 's|@/components/dashboard/|@/module/dashboard/components/|g' "$file"
    
    # Update type imports
    sed -i 's|@/types/|@/typings/|g' "$file"
    
    # Update schema imports
    sed -i 's|../api/db/schema|@/api/db/schema|g' "$file"
}

# Project components
for file in src/module/project/components/*.tsx; do
    update_imports "$file"
done

# Task components
for file in src/module/task/components/*.tsx; do
    update_imports "$file"
done

# Dashboard components
for file in src/module/dashboard/components/*.tsx; do
    update_imports "$file"
done

# Hooks
for file in src/module/{project,task,dashboard}/hooks/*.{ts,tsx}; do
    update_imports "$file"
done 