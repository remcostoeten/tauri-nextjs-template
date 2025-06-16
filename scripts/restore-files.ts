import fs from 'fs';
import path from 'path';

const filesToRestore: [string, string][] = [
  // UI Components
  ['src/_unused/shared/ui/sidebar.tsx', 'src/shared/ui/sidebar.tsx'],
  ['src/_unused/shared/ui/separator.tsx', 'src/shared/ui/separator.tsx'],
  ['src/_unused/shared/ui/toast.tsx', 'src/shared/ui/toast.tsx'],
  ['src/_unused/shared/ui/dropdown-menu.tsx', 'src/shared/ui/dropdown-menu.tsx'],
  ['src/_unused/shared/ui/dialog.tsx', 'src/shared/ui/dialog.tsx'],
  ['src/_unused/shared/ui/sonner.tsx', 'src/shared/ui/sonner.tsx'],
  ['src/_unused/shared/ui/index.ts', 'src/shared/ui/index.ts'],
  ['src/_unused/shared/ui/breadcrumb.tsx', 'src/shared/ui/breadcrumb.tsx'],
  ['src/_unused/shared/ui/avatar.tsx', 'src/shared/ui/avatar.tsx'],
  ['src/_unused/shared/ui/context-menu.tsx', 'src/shared/ui/context-menu.tsx'],
  ['src/_unused/shared/ui/badge.tsx', 'src/shared/ui/badge.tsx'],
  ['src/_unused/shared/ui/textarea.tsx', 'src/shared/ui/textarea.tsx'],
  ['src/_unused/shared/ui/sheet.tsx', 'src/shared/ui/sheet.tsx'],
  ['src/_unused/shared/ui/scroll-area.tsx', 'src/shared/ui/scroll-area.tsx'],
  ['src/_unused/shared/ui/select.tsx', 'src/shared/ui/select.tsx'],
  
  // Core Components
  ['src/_unused/shared/core/if-tauri.tsx', 'src/shared/core/if-tauri.tsx'],
  ['src/_unused/shared/core/if-web.tsx', 'src/shared/core/if-web.tsx'],
  ['src/_unused/components/toast.tsx', 'src/components/toast.tsx'],
  ['src/_unused/components/logo.tsx', 'src/components/logo.tsx'],
  ['src/_unused/components/effects/waves.tsx', 'src/components/effects/waves.tsx'],
  ['src/_unused/components/task/task-priority-select.tsx', 'src/components/task/task-priority-select.tsx'],
  
  // Dashboard Components
  ['src/_unused/module/dashboard/components/enterprise-sidebar.tsx', 'src/module/dashboard/components/enterprise-sidebar.tsx'],
  ['src/_unused/module/dashboard/components/sidebar-breadcrumb.tsx', 'src/module/dashboard/components/sidebar-breadcrumb.tsx'],
  ['src/_unused/module/dashboard/components/tasks-view.tsx', 'src/module/dashboard/components/tasks-view.tsx'],
  ['src/_unused/module/dashboard/hooks/use-sidebar-toggle.ts', 'src/module/dashboard/hooks/use-sidebar-toggle.ts'],
  
  // Git Components
  ['src/_unused/module/git/components/app-footer.tsx', 'src/module/git/components/app-footer.tsx'],
  ['src/_unused/module/git/hooks/index.ts', 'src/module/git/hooks/index.ts'],
  
  // Project Components
  ['src/_unused/module/project/components/project-list.tsx', 'src/module/project/components/project-list.tsx'],
  
  // Authentication Components
  ['src/_unused/module/authentication/ui/auth-form-skeleton.tsx', 'src/module/authentication/ui/auth-form-skeleton.tsx'],
  ['src/_unused/module/authentication/ui/login-form.tsx', 'src/module/authentication/ui/login-form.tsx'],
  ['src/_unused/module/authentication/ui/register-form.tsx', 'src/module/authentication/ui/register-form.tsx'],
  ['src/_unused/module/authentication/helpers/password.ts', 'src/module/authentication/helpers/password.ts'],
  
  // Core Components
  ['src/_unused/components/Version.tsx', 'src/components/Version.tsx'],
  ['src/_unused/components/providers.tsx', 'src/components/providers.tsx'],
  
  // Views
  ['src/_unused/views/login-view.tsx', 'src/views/login-view.tsx'],
  ['src/_unused/views/register-view.tsx', 'src/views/register-view.tsx'],
  ['src/_unused/views/index-view.tsx', 'src/views/index-view.tsx'],
  
  // Hooks
  ['src/_unused/hooks/use-user.ts', 'src/hooks/use-user.ts'],
  ['src/_unused/hooks/use-tasks.ts', 'src/hooks/use-tasks.ts'],
  ['src/_unused/shared/hooks/use-crud-factory.ts', 'src/shared/hooks/use-crud-factory.ts'],
  ['src/_unused/shared/hooks/use-mobile.ts', 'src/shared/hooks/use-mobile.ts'],
  
  // Types
  ['src/_unused/typings/auth.ts', 'src/typings/auth.ts'],
  ['src/_unused/typings/task.ts', 'src/typings/task.ts'],
  ['src/_unused/typings/project.ts', 'src/typings/project.ts'],
  
  // Schemas
  ['src/_unused/schemas/index.ts', 'src/schemas/index.ts'],
  
  // Styles and Utils
  ['src/_unused/styles/themes/index.ts', 'src/styles/themes/index.ts'],
  ['src/_unused/shared/lib/utils.ts', 'src/shared/lib/utils.ts'],
  ['src/_unused/shared/helpers/index.ts', 'src/shared/helpers/index.ts']
];

function restoreFile([sourcePath, targetPath]: [string, string]): void {
  try {
    // Check if the file exists in the _unused directory
    if (fs.existsSync(sourcePath)) {
      // Create the target directory if it doesn't exist
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Move the file back to its original location
      fs.renameSync(sourcePath, targetPath);
      console.log(`✓ Restored: ${sourcePath} -> ${targetPath}`);
    } else {
      console.log(`⚠ Not found: ${sourcePath}`);
    }
  } catch (error) {
    console.error(`✗ Error restoring ${sourcePath}:`, error);
  }
}

console.log('\nRestoring required files...\n');

// Restore each file
filesToRestore.forEach(restoreFile);

console.log('\nDone! Required files have been restored.'); 