"use client"

import React from "react"

import { Home, ChevronRight } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/shared/ui/breadcrumb"


type SidebarBreadcrumbItem = {
  label: string
  href?: string
  isActive?: boolean
}

type SidebarBreadcrumbProps = {
  items: SidebarBreadcrumbItem[]
  onNavigate?: (href: string) => void
}

export function SidebarBreadcrumb({ items, onNavigate }: SidebarBreadcrumbProps) {
  function handleNavigation(href: string) {
    onNavigate?.(href)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-1 text-[#b4b4b4] hover:text-white cursor-pointer transition-colors duration-200"
        >
          <Home className="size-4" />
        </BreadcrumbLink>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <BreadcrumbSeparator>
                <ChevronRight className="size-4 text-[#b4b4b4]" />
              </BreadcrumbSeparator>
            )}
            {item.isActive || !item.href ? (
              <BreadcrumbPage className="text-white font-medium">{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => item.href && handleNavigation(item.href)}
                className="text-[#b4b4b4] hover:text-white cursor-pointer transition-colors duration-200"
              >
                {item.label}
              </BreadcrumbLink>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
