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
import { useSidebarData } from "../hooks/use-sidebar-data"
import { useNavigationPreferences } from "../hooks/use-navigation-preferences"
import type { TNavigationItem, TSpace } from "../types/sidebar-types"
import { EnhancedSidebarSkeleton } from "./enhanced-sidebar-skeleton"
import { useProjects } from "../hooks/use-projects"
import { FancyWorkspaceSelector } from "./fancy-workspace-selector"
import { NavigationSettingsDialog } from "./navigation-settings-dialog"
import { NotificationBadge } from "./notification-badge"
import { SpaceContextMenu } from "./space-context-menu"
import { SidebarUserMenu } from './sidebar-user-menu'
import type { TProject } from "@/module/project/api/schema/project-schema"

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
  console.log({showFavorites})
  console.log({setShowFavorites})
  function handleProjectChange(project: TProject) {
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

  function handleSpaceAction(targetSpace: TSpace, action: string) {
    console.log(`Action: ${action} on space: ${targetSpace.id}`)
    switch (action) {
      case "open":
        handleNavigation(`/spaces/${targetSpace.id}`)
        break
      case "rename":
        // Handle rename
        break
      case "favorite":
        const updatedPrefs = data?.spaces
          .filter((s: TSpace) => s.id === targetSpace.id)
          .map((s: TSpace) => ({
            itemId: s.id,
            isFavorite: !s.isFavorite,
            isVisible: true,
            position: 0,
          }))
        if (updatedPrefs?.length) {
          updatePreferences(updatedPrefs)
        }
        break
      default:
        console.log("Unhandled action:", action)
    }
  }

  function renderNavigationItem(item: TNavigationItem) {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap]

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          isActive={item.isActive}
          tooltip={item.title}
          className="relative hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] data-[active=true]:bg-[#3f220d] data-[active=true]:text-[#f76808] text-[#ffffff] h-8 px-3 text-sm group"
        >
          <button onClick={() => handleNavigation(item.href)} className="w-full flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {IconComponent && <IconComponent className="size-4" />}
              <NotificationBadge notifications={item.notifications} />
            </div>
            <span className="truncate text-sm">{item.title}</span>
            {item.isFavorite && (
              <Star className="size-3.5 ml-auto text-[#f76808]" />
            )}
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  function renderSpace(space: TSpace, level = 0) {
    const IconComponent = iconMap[space.icon as keyof typeof iconMap]
    const isExpanded = expandedSpaces.has(space.id)
    const hasChildren = space.children && space.children.length > 0

    return (
      <React.Fragment key={space.id}>
        <SidebarMenuItem>
          <SpaceContextMenu space={space} onAction={(action) => handleSpaceAction(space, action)}>
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
                  {space.isFavorite && <Star className="size-3.5 text-[#f76808]" />}
                </div>
              </button>
            </SidebarMenuButton>
          </SpaceContextMenu>
        </SidebarMenuItem>
        {hasChildren && isExpanded && space.children?.map((child: TSpace) => renderSpace(child, level + 1))}
      </React.Fragment>
    )
  }

  // Apply navigation preferences to the navigation items
  const customizedNavigationItems = React.useMemo(() => {
    if (!data?.navigationItems) return []
    return applyPreferencesToNavigation(data.navigationItems)
  }, [data?.navigationItems, applyPreferencesToNavigation])

  // Filter favorite items
  const favoriteItems = React.useMemo(() => {
    return customizedNavigationItems.filter(item => item.isFavorite)
  }, [customizedNavigationItems])

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
        className="bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-screen flex flex-col"
      >
        <SidebarHeader className="border-b border-[#2a2a2a] p-1 flex-none">
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

        <SidebarContent className="px-1 flex-1 overflow-y-auto">
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
              <SidebarMenu className="space-y-0.5">
                {customizedNavigationItems.map(renderNavigationItem)}
              </SidebarMenu>
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
            {showFavorites && favoriteItems.length > 0 && (
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0">{favoriteItems.map(renderNavigationItem)}</SidebarMenu>
              </SidebarGroupContent>
            )}
            {showFavorites && favoriteItems.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#b4b4b4]">
                No favorites yet. Star items to add them here.
              </div>
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
              <SidebarMenu className="space-y-0.5">
                {data.spaces.map((space: TSpace) => renderSpace(space))}
              </SidebarMenu>
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

        <SidebarFooter className="border-t border-[#2a2a2a] p-1 flex-none">
          <SidebarMenu className="space-y-0">
            <SidebarUserMenu />
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
          isVisible: Boolean(pref.isVisible),
          isFavorite: Boolean(pref.isFavorite),
          position: pref.position,
          customLabel: pref.customLabel || undefined,
        }))}
      />
    </>
  )
}
