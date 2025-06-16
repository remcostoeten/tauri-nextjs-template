'use client';

import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';
import {
  Pencil,
  Copy,
  Star,
  Share2,
  Lock,
  Settings,
  Trash2,
} from 'lucide-react';
import type { t_space } from '../types/sidebar-types';

type Props = {
  space: t_space;
  onAction: (action: string, spaceId: string) => void;
  children: React.ReactNode;
};

export function SpaceContextMenu({ space, onAction, children }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-[#1a1a1a] border-[#2a2a2a]">
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('open', space.id)}
        >
          <span>Open Space</span>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('rename', space.id)}
        >
          <Pencil className="mr-2 size-3.5" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('duplicate', space.id)}
        >
          <Copy className="mr-2 size-3.5" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('favorite', space.id)}
        >
          <Star className="mr-2 size-3.5" />
          <span>Add to Favorites</span>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('share', space.id)}
        >
          <Share2 className="mr-2 size-3.5" />
          <span>Share</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('permissions', space.id)}
        >
          <Lock className="mr-2 size-3.5" />
          <span>Permissions</span>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm"
          onClick={() => onAction('settings', space.id)}
        >
          <Settings className="mr-2 size-3.5" />
          <span>Settings</span>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-[#2a2a2a]" />
        <ContextMenuItem
          className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-red-500 focus:text-red-500"
          onClick={() => onAction('delete', space.id)}
        >
          <Trash2 className="mr-2 size-3.5" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
} 