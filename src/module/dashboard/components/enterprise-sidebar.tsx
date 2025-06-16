"use client"

import * as React from "react"
import {
  Home,
  Mail,
  Users,
  FileText,
  BarChart3,
  Presentation,
  CheckSquare,
  Video,
  Target,
  Clock,
  MoreHorizontal,
  Globe,
  Rocket,
  Brain,
  User,
  Star,
  Search,
  Plus,
  HelpCircle,
  UserPlus,
  ChevronRight,
  ChevronDown,
  Calendar,
  MessageCircle,
  Compass,
  FolderOpen,
  Package,
  MessageSquare,
  Zap,
  Book,
  Database,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/sidebar"
import { Button } from "@/shared/ui/button"
import { FancyWorkspaceSelector } from "./fancy-workspace-selector"
import { NotificationBadge } from "./notification-badge"
import { SpaceContextMenu } from "./space-context-menu"
import { NavigationSettingsDialog } from "./navigation-settings-dialog"
import { useProjects } from "../hooks/use-projects"
import { useSidebarData } from "../hooks/use-sidebar-data"
import { useNavigationPreferences } from "../hooks/use-navigation-preferences"
import type { t_navigation_item, t_space } from "../types/sidebar-types"
import { EnhancedSidebarSkeleton } from "./enhanced-sidebar-skeleton"

const iconMap = {
  Home,
  Mail,
  Users,
  FileText,
  BarChart3,
  Presentation,
  CheckSquare,
  Video,
  Target,
  Clock,
  MoreHorizontal,
  Globe,
  Rocket,
  Brain,
  User,
  Star,
  Calendar,
  MessageCircle,
  Compass,
  FolderOpen,
  Package,
  MessageSquare,
  Zap,
  Book,
  Database,
  Search,
  Settings,
}

type EnterpriseSidebarProps = {
  onNavigate?: (href: string) => void
}

export function EnterpriseSidebar({ onNavigate }: EnterpriseSidebarProps) {
  const { data, isLoading: sidebarLoading, error: sidebarError } = useSidebarData()
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects()
  const {
    preferences,
    updatePreferences,
    applyPreferencesToNavigation,
    isLoading: preferencesLoading,
  } = useNavigationPreferences(currentProject?.id || null)
  const [expandedSpaces, setExpandedSpaces] = React.useState<Set<string>>(new Set(["product-team"]))
  const [showFavorites, setShowFavorites] = React.useState(false)
  const [showNavigationSettings, setShowNavigationSettings] = React.useState(false)

  function handleProjectChange(project: any) {
    setCurrentProject(project)
  }

  function handleNavigation(href: string) {
    onNavigate?.(href)
  }

  function toggleSpaceExpansion(spaceId: string) {
    setExpandedSpaces((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(spaceId)) {
        newSet.delete(spaceId)
      } else {
        newSet.add(spaceId)
      }
      return newSet
    })
  }

  function handleSpaceAction(action: string, spaceId: string) {
    console.log(`Action: ${action} on space: ${spaceId}`)
    switch (action) {
      case "open":
        handleNavigation(`/spaces/${spaceId}`)
        break
      case "rename":
        break
      case "duplicate":
        break
      case "favorite":
        break
      case "share":
        break
      case "permissions":
        break
      case "settings":
        break
      case "delete":
        break
      default:
        break
    }
  }

  function renderNavigationItem(item: t_navigation_item) {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap]

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          isActive={item.isActive}
          tooltip={item.title}
          className="relative hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] data-[active=true]:bg-[#3f220d] data-[active=true]:text-[#f76808] text-[#ffffff] h-8 px-3 text-sm"
        >
          <button onClick={() => handleNavigation(item.href)} className="w-full flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {IconComponent && <IconComponent className="size-4" />}
              <NotificationBadge notifications={item.notifications} />
            </div>
            <span className="truncate text-sm">{item.title}</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  function renderSpace(space: t_space, level = 0) {
    const IconComponent = iconMap[space.icon as keyof typeof iconMap]
    const isExpanded = expandedSpaces.has(space.id)
    const hasChildren = space.children && space.children.length > 0

    return (
      <React.Fragment key={space.id}>
        <SidebarMenuItem>
          <SpaceContextMenu space={space} onAction={handleSpaceAction}>
            <SidebarMenuButton
              asChild
              tooltip={space.name}
              className="hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] text-[#ffffff] h-7 px-3 text-sm group"
              style={{ paddingLeft: `${0.75 + level * 0.75}rem` }}
            >
              <button
                onClick={() => (hasChildren ? toggleSpaceExpansion(space.id) : handleNavigation(`/spaces/${space.id}`))}
                className="w-full flex items-center gap-2"
              >
                {hasChildren && (
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="size-3 text-[#b4b4b4]" />
                    ) : (
                      <ChevronRight className="size-3 text-[#b4b4b4]" />
                    )}
                  </div>
                )}
                <div
                  className="flex aspect-square size-5 items-center justify-center rounded text-white text-xs flex-shrink-0"
                  style={{ backgroundColor: space.color }}
                >
                  {IconComponent && <IconComponent className="size-3.5" />}
                </div>
                <span className="truncate text-sm flex-1">{space.name}</span>
                <div className="ml-auto flex items-center gap-1">
                  <NotificationBadge notifications={space.notifications} />
                  {space.isPrivate && <div className="text-[#b4b4b4] text-xs">🔒</div>}
                </div>
              </button>
            </SidebarMenuButton>
          </SpaceContextMenu>
        </SidebarMenuItem>
        {hasChildren && isExpanded && space.children?.map((child) => renderSpace(child, level + 1))}
      </React.Fragment>
    )
  }

  // Apply navigation preferences to the navigation items
  const customizedNavigationItems = React.useMemo(() => {
    if (!data?.navigationItems) return []
    return applyPreferencesToNavigation(data.navigationItems)
  }, [data?.navigationItems, applyPreferencesToNavigation])

  if (sidebarLoading || projectsLoading || preferencesLoading) {
    return <EnhancedSidebarSkeleton />
  }

  if (sidebarError || projectsError || !data || !currentProject) {
    return (
      <Sidebar className="bg-[#111111] border-r border-[#2a2a2a]">
        <SidebarContent>
          <div className="p-4 text-red-400">Error loading sidebar</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        <SidebarHeader className="border-b border-[#2a2a2a] p-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <FancyWorkspaceSelector
                currentProject={currentProject}
                projects={projects}
                onProjectChange={handleProjectChange}
                onCreateProject={createProject}
                onUpdateProject={updateProject}
                onDeleteProject={deleteProject}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between">
              Navigation
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNavigationSettings(true)}
                className="h-4 w-4 p-0 hover:bg-[#2a2a2a] text-[#b4b4b4] hover:text-white"
                title="Customize navigation"
              >
                <Settings className="size-3" />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">{customizedNavigationItems.map(renderNavigationItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel
              className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between cursor-pointer hover:text-white transition-colors"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <div className="flex items-center gap-1">
                {showFavorites ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                Favorites
              </div>
            </SidebarGroupLabel>
            {showFavorites && (
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0">{data.favorites.map(renderNavigationItem)}</SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between">
              Spaces
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-[#2a2a2a] text-[#b4b4b4]">
                  <Search className="size-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-[#2a2a2a] text-[#b4b4b4]">
                  <Plus className="size-3" />
                </Button>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">{data.spaces.map((space) => renderSpace(space))}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] h-7 px-3 text-sm"
                  >
                    <button onClick={() => handleNavigation("/spaces")} className="w-full flex items-center gap-3">
                      <MoreHorizontal className="size-4" />
                      <span>View all Spaces</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] h-7 px-3 text-sm"
                  >
                    <button
                      onClick={() => handleNavigation("/create-space")}
                      className="w-full flex items-center gap-3"
                    >
                      <Plus className="size-4" />
                      <span>Create Space</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-[#2a2a2a] p-1">
          <SidebarMenu className="space-y-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] h-7 px-3 text-sm"
              >
                <button onClick={() => handleNavigation("/invite")} className="w-full flex items-center gap-3">
                  <UserPlus className="size-4 text-[#b4b4b4]" />
                  <span className="text-[#ffffff]">Invite</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] h-7 px-3 text-sm"
              >
                <button onClick={() => handleNavigation("/help")} className="w-full flex items-center gap-3">
                  <HelpCircle className="size-4 text-[#b4b4b4]" />
                  <span className="text-[#ffffff]">Help</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <NavigationSettingsDialog
        open={showNavigationSettings}
        onOpenChange={setShowNavigationSettings}
        navigationItems={data.navigationItems}
        onSave={updatePreferences}
        currentPreferences={preferences.map((pref) => ({
          itemId: pref.itemId,
          isVisible: pref.isVisible,
          position: pref.position,
          customLabel: pref.customLabel || undefined,
        }))}
      />
    </>
  )
}
