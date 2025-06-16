export type TNotification = {
  id: string
  count: number
  type: 'info' | 'warning' | 'error'
}

export type TNavigationItem = {
  id: string
  title: string
  icon: string
  href: string
  isActive?: boolean
  notifications?: TNotification[]
  children?: TNavigationItem[]
  isExpanded?: boolean
  level?: number
  isFavorite?: boolean 
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

export type TNavigationPreference = {
  itemId: string
  isVisible: boolean
  position: number
  customLabel?: string
  isFavorite?: boolean
}
