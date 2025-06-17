import type { TSidebarData, TWorkspace, TNavigationItem, TSpace, TNotification } from "../types/sidebar-types"

function getMockSidebarData(): TSidebarData {
  const workspaces: TWorkspace[] = [
    {
      id: "1",
      name: "Personal",
      avatar: "👤",
      color: "#f76808",
    },
  ]

  const navigationItems: TNavigationItem[] = [
    {
      id: "home",
      title: "Home",
      href: "/dashboard",
      icon: "Home",
      isActive: true,
      isFavorite: false,
      notifications: [],
    },
    {
      id: "tasks",
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: "CheckSquare",
      isActive: false,
      isFavorite: false,
      notifications: [],
    },
    {
      id: "projects",
      title: "Projects",
      href: "/dashboard/projects",
      icon: "FolderOpen",
      isActive: false,
      isFavorite: false,
      notifications: [],
    },
  ]

  const spaces: TSpace[] = [
    {
      id: "product-team",
      name: "Product Team",
      icon: "Target",
      color: "#f76808",
      isFavorite: false,
      children: [
        {
          id: "roadmap",
          name: "Roadmap",
          icon: "Target",
          color: "#5842c8",
          isFavorite: false,
          children: [],
        },
        {
          id: "backlog",
          name: "Backlog",
          icon: "Database",
          color: "#2ea44f",
          isFavorite: false,
          children: [],
        },
      ],
    },
    {
      id: "development",
      name: "Development",
      icon: "Code",
      color: "#5842c8",
      isFavorite: false,
      children: [],
    },
  ]

  return {
    currentWorkspace: workspaces[0],
    workspaces,
    navigationItems,
    favorites: navigationItems.filter(item => item.isFavorite),
    spaces,
  }
}

export async function getSidebarData(): Promise<TSidebarData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return getMockSidebarData()
}

export function getNotificationCount(itemId: string): number {
  const data = getMockSidebarData()
  const item = data.navigationItems.find((item) => item.id === itemId)
  return item?.notifications?.reduce((sum: number, notif: TNotification) => sum + notif.count, 0) || 0
}
