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
      id: "1",
      title: "Home",
      href: "/",
      icon: "Home",
      isActive: true,
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
          color: "#f76808",
          isFavorite: false,
          children: [],
        },
      ],
    },
  ]

  return {
    currentWorkspace: workspaces[0],
    workspaces,
    navigationItems,
    favorites: [],
    spaces,
  }
}

export async function getSidebarData(): Promise<TSidebarData> {
  return getMockSidebarData()
}

export function getNotificationCount(itemId: string): number {
  const data = getMockSidebarData()
  const item = data.navigationItems.find((item) => item.id === itemId)
  return item?.notifications?.reduce((sum: number, notif: TNotification) => sum + notif.count, 0) || 0
}
