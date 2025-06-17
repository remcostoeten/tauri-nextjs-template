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
  ChevronRight,
  ChevronDown,
  Globe,
  Rocket,
  Brain,
  User,
  Star,
  Settings,
  Compass,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Plus,
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
import type { TNavigationItem, TNavigationPreferenceUI } from "../types/sidebar-types"
import { EnhancedSidebarSkeleton } from "./enhanced-sidebar-skeleton"
import { useProjects } from "../hooks/use-projects"
import { FancyWorkspaceSelector } from "./fancy-workspace-selector"
import { NavigationSettingsDialog } from "./navigation-settings-dialog"
import { NotificationBadge } from "./notification-badge"
import { SidebarUserMenu } from "./sidebar-user-menu"
import type { TProject } from "@/module/project/api/schema/project-schema"
import { useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/shared/ui/dropdown-menu"
import { Input } from "@/shared/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"

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
  Globe,
  Rocket,
  Brain,
  User,
  Star,
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
  const [showFavorites, setShowFavorites] = React.useState(true)
  const [showNavigationSettings, setShowNavigationSettings] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<TNavigationItem | null>(null)
  const [newItemTitle, setNewItemTitle] = React.useState("")
  const [showNewItemDialog, setShowNewItemDialog] = React.useState(false)

  function handleProjectChange(project: TProject) {
    setCurrentProject(project)
  }

  function handleNavigation(href: string) {
    onNavigate?.(href)
  }

  function handleNavigationAction(item: TNavigationItem, action: string) {
    switch (action) {
      case "open":
        handleNavigation(item.href || "")
        break
      case "favorite":
        updateItemPreference(item, { isFavorite: item.isFavorite ? 0 : 1 })
        break
      case "toggle-visibility":
        updateItemPreference(item, { isVisible: item.isVisible ? 0 : 1 })
        break
      case "edit":
        setEditingItem(item)
        setNewItemTitle(item.customLabel || item.title)
        break
      case "delete":
        handleDeleteItem(item)
        break
      default:
        console.log("Unhandled action:", action)
    }
  }

  async function updateItemPreference(item: TNavigationItem, updates: Partial<TNavigationPreferenceUI>) {
    const updatedPrefs: TNavigationPreferenceUI[] = [
      {
        itemId: item.id,
        isVisible: updates.isVisible ?? (item.isVisible ? 1 : 0),
        isFavorite: updates.isFavorite ?? (item.isFavorite ? 1 : 0),
        position: item.position || 0,
        customLabel: updates.customLabel ?? item.customLabel,
      },
    ]
    try {
      await updatePreferences(updatedPrefs)
      toast.success("Navigation item updated")
    } catch (error) {
      toast.error("Failed to update navigation item")
    }
  }

  async function handleDeleteItem(item: TNavigationItem) {
    try {
      await updateItemPreference(item, { isVisible: 0 })
      toast.success("Navigation item removed")
    } catch (error) {
      toast.error("Failed to remove navigation item")
    }
  }

  async function handleSaveEdit() {
    if (!editingItem) return
    try {
      await updateItemPreference(editingItem, { customLabel: newItemTitle })
      setEditingItem(null)
      setNewItemTitle("")
      toast.success("Navigation item updated")
    } catch (error) {
      toast.error("Failed to update navigation item")
    }
  }

  function renderNavigationItem(item: TNavigationItem) {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap]

    return (
      <SidebarMenuItem key={item.id}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              tooltip={item.title}
              className="relative hover:bg-[#2a2a2a] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] data-[active=true]:bg-[#3f220d] data-[active=true]:text-primary text-[#ffffff] h-8 px-3 text-sm group"
            >
              <button className="w-full flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {IconComponent && <IconComponent className="size-4" />}
                  <NotificationBadge notifications={item.notifications} />
                </div>
                <span className="truncate text-sm">{item.customLabel || item.title}</span>
                <div className="ml-auto flex items-center gap-1">
                  {!item.isVisible && <EyeOff className="size-3.5 text-[#666666]" />}
                  {item.isFavorite && <Star className="size-3.5 text-red-400" />}
                </div>
              </button>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuItem onClick={() => handleNavigationAction(item, "open")}>
              <ChevronRight className="mr-2 h-4 w-4" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationAction(item, "favorite")}>
              <Star className="mr-2 h-4 w-4" />
              {item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigationAction(item, "toggle-visibility")}>
              {item.isVisible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide from sidebar
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show in sidebar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigationAction(item, "edit")}>
              <Edit2 className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigationAction(item, "delete")}
              className="text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  const noRegularItems = useMemo(() => {
    return data?.navigationItems?.filter((item: TNavigationItem) => !item.isFavorite)
  }, [data?.navigationItems])

  const noFavoriteItems = useMemo(() => {
    return data?.navigationItems?.filter((item: TNavigationItem) => item.isFavorite)
  }, [data?.navigationItems])

  const customizedNavigationItems = useMemo(() => {
    if (!noRegularItems || !noFavoriteItems) return []
    return applyPreferencesToNavigation(noRegularItems)
  }, [noRegularItems, noFavoriteItems, applyPreferencesToNavigation])

  const { favoriteItems, regularItems } = useMemo(() => {
    return {
      favoriteItems: customizedNavigationItems.filter((item) => item.isFavorite),
      regularItems: customizedNavigationItems.filter((item) => !item.isFavorite),
    }
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
          {(regularItems && regularItems.length > 0) || true ? (
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
              {(!regularItems || regularItems.length === 0) && (
                <div className="px-3 py-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <Compass className="size-4 text-[#666666]" />
                    </div>
                    <div className="text-xs text-[#888888]">No navigation items</div>
                    <div className="text-xs text-[#666666] leading-relaxed">Customize your navigation in settings</div>
                  </div>
                </div>
              )}
              {regularItems && regularItems.length > 0 && (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-0.5">{regularItems.map(renderNavigationItem)}</SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ) : null}

          <SidebarGroup>
            <SidebarGroupLabel
              className="text-[#b4b4b4] text-xs font-medium px-2 py-1 flex items-center justify-between cursor-pointer hover:text-white transition-colors"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <div className="flex items-center gap-1">
                <div className="transition-transform duration-200 ease-in-out">
                  {showFavorites ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                </div>
                Favorites
              </div>
            </SidebarGroupLabel>
            {showFavorites && (
              <SidebarGroupContent className="transition-all duration-300 ease-in-out">
                {favoriteItems.length > 0 ? (
                  <SidebarMenu className="space-y-0">{favoriteItems.map(renderNavigationItem)}</SidebarMenu>
                ) : (
                  <div className="px-3 py-4 text-center transition-all duration-300 ease-in-out">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                        <Star className="size-4 text-[#666666]" />
                      </div>
                      <div className="text-xs text-[#888888]">No favorites yet</div>
                      <div className="text-xs text-[#666666] leading-relaxed">Star items to add them here</div>
                    </div>
                  </div>
                )}
              </SidebarGroupContent>
            )}
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
        navigationItems={customizedNavigationItems}
        onSave={updatePreferences}
        currentPreferences={preferences.map((pref) => ({
          itemId: pref.itemId,
          isVisible: pref.isVisible,
          isFavorite: pref.isFavorite,
          position: pref.position,
          customLabel: pref.customLabel,
        }))}
      />

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Navigation Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Custom Label</Label>
              <Input
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter custom label..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
