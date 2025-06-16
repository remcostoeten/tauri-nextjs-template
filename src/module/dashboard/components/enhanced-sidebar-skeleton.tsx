"use client"

import { ShimmerSkeleton } from "./shimmer-skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/sidebar"

export function EnhancedSidebarSkeleton() {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    >
      <SidebarHeader className="border-b border-[#2a2a2a] p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Workspace Selector Skeleton */}
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <ShimmerSkeleton className="size-9 rounded-xl" />
              <div className="flex flex-col gap-1 flex-1">
                <ShimmerSkeleton className="h-4 w-24" />
                <ShimmerSkeleton className="h-3 w-16" />
              </div>
              <ShimmerSkeleton className="size-4" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {/* Navigation Items Skeleton */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {Array.from({ length: 8 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex items-center gap-3 h-8 px-3 rounded-lg">
                    <ShimmerSkeleton className="size-4" />
                    <ShimmerSkeleton className="h-3 flex-1" style={{ width: `${60 + Math.random() * 40}%` }} />
                    {Math.random() > 0.7 && <ShimmerSkeleton className="size-3 rounded-full" />}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorites Section Skeleton */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ShimmerSkeleton className="size-3" />
              <ShimmerSkeleton className="h-3 w-16" />
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Spaces Section Skeleton */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between">
            <ShimmerSkeleton className="h-3 w-12" />
            <div className="flex items-center gap-1">
              <ShimmerSkeleton className="size-3" />
              <ShimmerSkeleton className="size-3" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {/* Main spaces */}
              {Array.from({ length: 4 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex items-center gap-2 h-7 px-3 rounded-lg">
                    {index === 1 && <ShimmerSkeleton className="size-3" />}
                    <ShimmerSkeleton className="size-5 rounded" />
                    <ShimmerSkeleton className="h-3 flex-1" style={{ width: `${50 + Math.random() * 30}%` }} />
                    {Math.random() > 0.5 && <ShimmerSkeleton className="size-3 rounded-full" />}
                  </div>
                </SidebarMenuItem>
              ))}

              {/* Nested spaces */}
              {Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem key={`nested-${index}`}>
                  <div className="flex items-center gap-2 h-7 px-3 rounded-lg" style={{ paddingLeft: "1.5rem" }}>
                    <ShimmerSkeleton className="size-5 rounded" />
                    <ShimmerSkeleton className="h-3 flex-1" style={{ width: `${40 + Math.random() * 30}%` }} />
                    {Math.random() > 0.7 && <ShimmerSkeleton className="size-3 rounded-full" />}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Additional Actions Skeleton */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {Array.from({ length: 2 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex items-center gap-3 h-7 px-3 rounded-lg">
                    <ShimmerSkeleton className="size-4" />
                    <ShimmerSkeleton className="h-3 flex-1" style={{ width: `${50 + Math.random() * 25}%` }} />
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#2a2a2a] p-1">
        <SidebarMenu className="space-y-0">
          {Array.from({ length: 2 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <div className="flex items-center gap-3 h-7 px-3 rounded-lg">
                <ShimmerSkeleton className="size-4" />
                <ShimmerSkeleton className="h-3 flex-1" style={{ width: `${40 + Math.random() * 20}%` }} />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
