"use client"

import { Skeleton } from "@/components/ui/skeleton"
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
} from "@/components/ui/sidebar"

export function SidebarSkeleton() {
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
              <Skeleton className="size-9 rounded-xl bg-[#2a2a2a]" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-24 bg-[#2a2a2a]" />
                <Skeleton className="h-3 w-16 bg-[#2a2a2a]" />
              </div>
              <Skeleton className="size-4 bg-[#2a2a2a]" />
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
                    <Skeleton className="size-4 bg-[#2a2a2a]" />
                    <Skeleton className="h-3 flex-1 bg-[#2a2a2a]" style={{ width: `${60 + Math.random() * 40}%` }} />
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
              <Skeleton className="size-3 bg-[#2a2a2a]" />
              <Skeleton className="h-3 w-16 bg-[#2a2a2a]" />
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Spaces Section Skeleton */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between">
            <Skeleton className="h-3 w-12 bg-[#2a2a2a]" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-3 bg-[#2a2a2a]" />
              <Skeleton className="size-3 bg-[#2a2a2a]" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {/* Main spaces */}
              {Array.from({ length: 4 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex items-center gap-2 h-7 px-3 rounded-lg">
                    {index === 1 && <Skeleton className="size-3 bg-[#2a2a2a]" />}
                    <Skeleton className="size-5 rounded bg-[#2a2a2a]" />
                    <Skeleton className="h-3 flex-1 bg-[#2a2a2a]" style={{ width: `${50 + Math.random() * 30}%` }} />
                    {Math.random() > 0.5 && <Skeleton className="size-3 rounded-full bg-[#2a2a2a]" />}
                  </div>
                </SidebarMenuItem>
              ))}

              {/* Nested spaces */}
              {Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem key={`nested-${index}`}>
                  <div className="flex items-center gap-2 h-7 px-3 rounded-lg" style={{ paddingLeft: "1.5rem" }}>
                    <Skeleton className="size-5 rounded bg-[#2a2a2a]" />
                    <Skeleton className="h-3 flex-1 bg-[#2a2a2a]" style={{ width: `${40 + Math.random() * 30}%` }} />
                    {Math.random() > 0.7 && <Skeleton className="size-3 rounded-full bg-[#2a2a2a]" />}
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
                    <Skeleton className="size-4 bg-[#2a2a2a]" />
                    <Skeleton className="h-3 flex-1 bg-[#2a2a2a]" style={{ width: `${50 + Math.random() * 25}%` }} />
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
                <Skeleton className="size-4 bg-[#2a2a2a]" />
                <Skeleton className="h-3 flex-1 bg-[#2a2a2a]" style={{ width: `${40 + Math.random() * 20}%` }} />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
