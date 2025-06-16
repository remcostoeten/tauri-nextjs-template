"use client"

import "./styles/sidebar-theme.css"
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EnterpriseSidebar } from "./components/enterprise-sidebar"
import { SidebarBreadcrumb } from "./components/sidebar-breadcrumb"
import { useSidebarToggle } from "./hooks/use-sidebar-toggle"

export default function Page() {
  const { isOpen, toggle } = useSidebarToggle()
  const [currentPath, setCurrentPath] = React.useState("/home")

  function handleNavigation(href: string) {
    setCurrentPath(href)
    console.log("Navigating to:", href)
  }

  function getBreadcrumbItems() {
    const pathSegments = currentPath.split("/").filter(Boolean)

    if (pathSegments.length === 0 || pathSegments[0] === "home") {
      return [{ label: "Home", isActive: true }]
    }

    return pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: index === pathSegments.length - 1 ? undefined : `/${pathSegments.slice(0, index + 1).join("/")}`,
      isActive: index === pathSegments.length - 1,
    }))
  }

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <EnterpriseSidebar onNavigate={handleNavigation} />
      <SidebarInset className="bg-[#0f0f0f] min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#2a2a2a] px-4 bg-[#111111]">
          <SidebarTrigger className="-ml-1 text-[#b4b4b4] hover:text-white hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-[#2a2a2a]" />
          <SidebarBreadcrumb items={getBreadcrumbItems()} onNavigate={handleNavigation} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]" />
            <div className="aspect-video rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]" />
            <div className="aspect-video rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] md:min-h-min p-6">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-4">Good morning</h1>
              <p className="text-[#b4b4b4]">Current path: {currentPath}</p>
              <div className="mt-8 space-y-4">
                <div className="text-lg font-semibold">Recent Activity</div>
                <div className="space-y-2">
                  <div className="p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="font-medium">📊 Weekly Report</div>
                    <div className="text-sm text-[#b4b4b4]">Updated 2 hours ago</div>
                  </div>
                  <div className="p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="font-medium">🎯 Q4 Goals</div>
                    <div className="text-sm text-[#b4b4b4]">Updated yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
