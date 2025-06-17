export type TNotification = {
  id: string
  type: string
  count: number
}

export type TNavigationItem = {
  id: string
  title: string
  href?: string
  icon?: string
  isActive?: boolean
  isFavorite?: boolean
  notifications?: TNotification[]
  customLabel?: string | null
  position?: number
  isVisible?: boolean
}

export type TWorkspace = {
  id: string
  name: string
  avatar: string
  color: string
}

export type TSpace = {
  id: string
  name: string
  icon: string
  color: string
  href?: string
  isPrivate?: boolean
  notifications?: TNotification[]
  children?: TSpace[]
  isFavorite?: boolean 
}

export type TSidebarData = {
  currentWorkspace: TWorkspace
  workspaces: TWorkspace[]
  navigationItems: TNavigationItem[]
  favorites: TNavigationItem[]
  spaces: TSpace[]
  isCollapsed?: boolean
}

// This type represents the UI version of navigation preferences
export type TNavigationPreferenceUI = {
  itemId: string
  isVisible: number
  position: number
  customLabel?: string | null
  isFavorite: number
}

// Re-export the database type for convenience
export type { TNavigationPreference } from "@/module/dashboard/api/schema/navigation-preferences-schema"
