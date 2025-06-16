"use client"

import type * as React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Edit, Trash2, Copy, Star, Settings, Users, Lock } from "lucide-react"
import type { t_space } from "../types/sidebar-types"

type SpaceContextMenuProps = {
  space: t_space
  children: React.ReactNode
  onAction: (action: string, spaceId: string) => void
}

export function SpaceContextMenu({ space, children, onAction }: SpaceContextMenuProps) {
  function handleAction(action: string) {
    onAction(action, space.id)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-white">
        <ContextMenuItem
          onClick={() => handleAction("open")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          Open Space
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          onClick={() => handleAction("rename")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Edit className="size-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleAction("duplicate")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Copy className="size-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleAction("favorite")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Star className="size-4 mr-2" />
          Add to Favorites
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          onClick={() => handleAction("share")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Users className="size-4 mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleAction("permissions")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Lock className="size-4 mr-2" />
          Permissions
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleAction("settings")}
          className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
        >
          <Settings className="size-4 mr-2" />
          Settings
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          onClick={() => handleAction("delete")}
          className="hover:bg-red-600 focus:bg-red-600 cursor-pointer text-red-400 hover:text-white focus:text-white"
        >
          <Trash2 className="size-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
