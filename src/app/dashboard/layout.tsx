"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { EnterpriseSidebar } from "@/module/dashboard/components/enterprise-sidebar"
import { SidebarBreadcrumb } from "@/module/dashboard/components/sidebar-breadcrumb"
import { useSidebarToggle } from "@/module/dashboard/hooks/use-sidebar-toggle"
import { Separator } from "@/shared/ui/separator"
import { useEffect } from "react"
import { getSession } from "@/module/authentication/helpers/session"
import { AppFooter } from "@/module/git/components/app-footer"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen } = useSidebarToggle()
  const [currentPath, setCurrentPath] = React.useState("/home")
  const router = useRouter()

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const session = await getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkSession()
  }, [router])

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
      <div className="flex h-[100vh] overflow-hidden">
        <div className="flex-none">
          <EnterpriseSidebar onNavigate={handleNavigation} />
        </div>
        <SidebarInset className="flex flex-col flex-1 bg-[#0f0f0f]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#2a2a2a] px-4 bg-[#111111]">
            <SidebarTrigger className="-ml-1 text-[#b4b4b4] hover:text-white hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-[#2a2a2a]" />
            <SidebarBreadcrumb items={getBreadcrumbItems()} onNavigate={handleNavigation} />
          </header>
          <div className="flex flex-col h-[calc(100vh-4rem-3.5rem)]"> {/* 4rem (64px) for header, 3.5rem (56px) for footer */}
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
          </div>
          <footer className="h-14 border-t border-[#2a2a2a] bg-[#111111]">
            <AppFooter />
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
