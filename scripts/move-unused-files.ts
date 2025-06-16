import fs from 'fs';
import path from 'path';

const unusedFiles = [
  'src/middleware.ts',
  'src/views/task-view.tsx',
  'src/views/task-detail-view.tsx',
  'src/views/register-view.tsx',
  'src/views/login-view.tsx',
  'src/views/index-view.tsx',
  'src/typings/task.ts',
  'src/typings/sidebar.ts',
  'src/typings/project.ts',
  'src/typings/oauth.ts',
  'src/typings/global.d.ts',
  'src/typings/git.ts',
  'src/typings/auth.ts',
  'src/schemas/index.ts',
  'src/lib/utils.ts',
  'src/lib/auth.ts',
  'src/hooks/use-user.ts',
  'src/hooks/use-toast.ts',
  'src/hooks/use-tasks.ts',
  'src/hooks/use-auth.ts',
  'src/components/toast.tsx',
  'src/components/theme-switcher.tsx',
  'src/components/providers.tsx',
  'src/components/logo.tsx',
  'src/components/Version.tsx',
  'src/components/ProjectName.tsx',
  'src/styles/themes/index.ts',
  'src/shared/ui/use-toast.ts',
  'src/shared/ui/use-mobile.tsx',
  'src/shared/ui/toggle.tsx',
  'src/shared/ui/toggle-group.tsx',
  'src/shared/ui/toaster.tsx',
  'src/shared/ui/toast.tsx',
  'src/shared/ui/textarea.tsx',
  'src/shared/ui/tabs.tsx',
  'src/shared/ui/table.tsx',
  'src/shared/ui/switch.tsx',
  'src/shared/ui/sonner.tsx',
  'src/shared/ui/slider.tsx',
  'src/shared/ui/sidebar.tsx',
  'src/shared/ui/sheet.tsx',
  'src/shared/ui/separator.tsx',
  'src/shared/ui/select.tsx',
  'src/shared/ui/scroll-area.tsx',
  'src/shared/ui/resizable.tsx',
  'src/shared/ui/radio-group.tsx',
  'src/shared/ui/progress.tsx',
  'src/shared/ui/popover.tsx',
  'src/shared/ui/pagination.tsx',
  'src/shared/ui/navigation-menu.tsx',
  'src/shared/ui/menubar.tsx',
  'src/shared/ui/input-otp.tsx',
  'src/shared/ui/index.ts',
  'src/shared/ui/hover-card.tsx',
  'src/shared/ui/form.tsx',
  'src/shared/ui/dropdown-menu.tsx',
  'src/shared/ui/drawer.tsx',
  'src/shared/ui/dialog.tsx',
  'src/shared/ui/context-menu.tsx',
  'src/shared/ui/command.tsx',
  'src/shared/ui/collapsible.tsx',
  'src/shared/ui/checkbox.tsx',
  'src/shared/ui/chart.tsx',
  'src/shared/ui/calendar.tsx',
  'src/shared/ui/breadcrumb.tsx',
  'src/shared/ui/badge.tsx',
  'src/shared/ui/avatar.tsx',
  'src/shared/lib/utils.ts',
  'src/shared/hooks/use-mobile.tsx',
  'src/shared/hooks/use-mobile.ts',
  'src/shared/hooks/use-crud-factory.ts',
  'src/shared/helpers/index.ts',
  'src/shared/core/index.ts',
  'src/components/task/task-priority-select.tsx',
  'src/components/effects/waves.tsx',
  'src/components/dashboard/overview.tsx',
  'src/components/dashboard/header.tsx',
  'src/components/_misc/RoundedButton.tsx',
  'src/module/project/hooks/use-projects.tsx',
  'src/module/project/components/project-list.tsx',
  'src/module/git/hooks/use-system-tray.ts',
  'src/module/git/hooks/index.ts',
  'src/module/git/components/index.ts',
  'src/module/git/components/commit-tree.tsx',
  'src/module/git/components/app-footer.tsx',
  'src/module/dashboard/hooks/use-sidebar-toggle.ts',
  'src/module/dashboard/hooks/use-navigation-preferences.tsx',
  'src/module/dashboard/components/workspace-selector.tsx',
  'src/module/dashboard/components/tasks-view.tsx',
  'src/module/dashboard/components/sidebar-skeleton.tsx',
  'src/module/dashboard/components/sidebar-breadcrumb.tsx',
  'src/module/dashboard/components/enterprise-sidebar.tsx',
  'src/module/authentication/ui/register-form.tsx',
  'src/module/authentication/ui/login-form.tsx',
  'src/module/authentication/ui/auth-form-skeleton.tsx',
  'src/module/authentication/helpers/password.ts',
  'src/module/authentication/helpers/index.ts',
  'src/components/dashboard/profile/profile-form.tsx'
];

function moveFile(sourcePath: string): void {
  try {
    // Create the target path in the _unused directory
    const targetPath = sourcePath.replace('src/', 'src/_unused/');
    const targetDir = path.dirname(targetPath);

    // Create the directory structure if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Move the file if it exists
    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath);
      console.log(`✓ Moved: ${sourcePath} -> ${targetPath}`);
    } else {
      console.log(`⚠ Skipped: ${sourcePath} (file not found)`);
    }
  } catch (error) {
    console.error(`✗ Error moving ${sourcePath}:`, error);
  }
}

console.log('\nMoving unused files to src/_unused/...\n');

// Move each file
unusedFiles.forEach(moveFile);

console.log('\nDone! Files have been moved to src/_unused/');
console.log('You can restore them later if needed, or delete the _unused directory if you\'re sure they\'re not needed.'); 