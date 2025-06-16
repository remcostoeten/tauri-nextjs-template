"use client"

import { ChevronDown, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import type { t_workspace } from "../types/sidebar-types"

type WorkspaceSelectorProps = {
  currentWorkspace: t_workspace
  workspaces: t_workspace[]
  onWorkspaceChange: (workspace: t_workspace) => void
}

export function WorkspaceSelector({ currentWorkspace, workspaces, onWorkspaceChange }: WorkspaceSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip={currentWorkspace.name}
          className="data-[state=open]:bg-[#2a2a2a] data-[state=open]:text-white hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: currentWorkspace.color }}
          >
            {currentWorkspace.avatar}
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-white">{currentWorkspace.name}</span>
          </div>
          <ChevronDown className="ml-auto text-[#b4b4b4] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:rotate-180" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] bg-[#1a1a1a] border-[#2a2a2a]"
        align="start"
      >
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => onWorkspaceChange(workspace)}
            className="text-white hover:bg-[#2a2a2a] cursor-pointer"
          >
            <div
              className="flex aspect-square size-6 items-center justify-center rounded-md text-white font-semibold text-xs mr-2"
              style={{ backgroundColor: workspace.color }}
            >
              {workspace.avatar}
            </div>
            {workspace.name}
            {workspace.id === currentWorkspace.id && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
