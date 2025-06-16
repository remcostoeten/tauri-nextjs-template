'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { ChevronDown } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  avatar?: string;
  color: string;
};

type Props = {
  currentProject: Project;
  projects: Project[];
  onProjectChange: (project: Project) => void;
  onCreateProject: (name: string) => Promise<void>;
  onUpdateProject: (id: string, data: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
};

export function FancyWorkspaceSelector({
  currentProject,
  projects,
  onProjectChange,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] text-[#ffffff] h-12 px-3"
        >
          <div
            className="flex aspect-square h-9 items-center justify-center rounded-xl text-white text-lg font-semibold"
            style={{ backgroundColor: currentProject.color }}
          >
            {currentProject.name[0].toUpperCase()}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentProject.name}</span>
            <span className="text-xs text-[#b4b4b4]">Switch workspace</span>
          </div>
          <ChevronDown className="ml-auto size-4 text-[#b4b4b4]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#1a1a1a] border-[#2a2a2a]"
      >
        <DropdownMenuLabel className="text-[#b4b4b4]">Workspaces</DropdownMenuLabel>
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a]"
            onClick={() => {
              onProjectChange(project);
              setIsOpen(false);
            }}
          >
            <div
              className="flex aspect-square h-8 items-center justify-center rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0].toUpperCase()}
            </div>
            <span className="text-sm text-white">{project.name}</span>
            {project.id === currentProject.id && (
              <span className="ml-auto text-xs text-[#b4b4b4]">Current</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-[#2a2a2a]" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-[#b4b4b4]"
          onClick={() => {
            // Implement create workspace flow
            setIsOpen(false);
          }}
        >
          Create Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 