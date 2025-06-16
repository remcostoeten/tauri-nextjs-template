export type t_notification = {
  id: string
  count: number
  type: "info" | "warning" | "error"
}

export type t_navigation_item = {
  id: string
  title: string
  icon: string
  href: string
  isActive?: boolean
  notifications?: t_notification[]
  children?: t_navigation_item[]
  isExpanded?: boolean
  level?: number
}

export type t_workspace = {
  id: string
  name: string
  avatar: string
  color: string
}

export type t_space = {
  id: string
  name: string
  icon: string
  color: string
  isPrivate?: boolean
  children?: t_space[]
  isExpanded?: boolean
  notifications?: t_notification[]
  hasActions?: boolean
}

export type t_sidebar_data = {
  currentWorkspace: t_workspace
  workspaces: t_workspace[]
  navigationItems: t_navigation_item[]
  favorites: t_navigation_item[]
  spaces: t_space[]
  isCollapsed?: boolean
}

export type tSidebarData = t_sidebar_data
