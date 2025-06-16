import type { t_sidebar_data, t_workspace, t_navigation_item, t_space } from "../types/sidebar-types"

function getMockSidebarData(): t_sidebar_data {
  const workspaces: t_workspace[] = [
    {
      id: "1",
      name: "Brainstud",
      avatar: "🧠",
      color: "#f76808",
    },
    {
      id: "2",
      name: "Product Team",
      avatar: "🚀",
      color: "#e93d82",
    },
  ]

  const navigationItems: t_navigation_item[] = [
    {
      id: "home",
      title: "Home",
      icon: "Home",
      href: "/home",
      isActive: true,
    },
    {
      id: "inbox",
      title: "Inbox",
      icon: "Mail",
      href: "/inbox",
      notifications: [{ id: "1", count: 2, type: "info" }],
    },
    {
      id: "teams",
      title: "Teams",
      icon: "Users",
      href: "/teams",
    },
    {
      id: "docs",
      title: "Docs",
      icon: "FileText",
      href: "/docs",
    },
    {
      id: "dashboards",
      title: "Dashboards",
      icon: "BarChart3",
      href: "/dashboards",
    },
    {
      id: "whiteboards",
      title: "Whiteboards",
      icon: "Presentation",
      href: "/whiteboards",
    },
    {
      id: "forms",
      title: "Forms",
      icon: "CheckSquare",
      href: "/forms",
    },
    {
      id: "clips",
      title: "Clips",
      icon: "Video",
      href: "/clips",
    },
    {
      id: "goals",
      title: "Goals",
      icon: "Target",
      href: "/goals",
    },
    {
      id: "timesheets",
      title: "Timesheets",
      icon: "Clock",
      href: "/timesheets",
    },
    {
      id: "more",
      title: "More",
      icon: "MoreHorizontal",
      href: "/more",
    },
  ]

  const spaces: t_space[] = [
    {
      id: "everything",
      name: "Everything",
      icon: "Globe",
      color: "#ffffff",
    },
    {
      id: "product-team",
      name: "Product Team",
      icon: "Rocket",
      color: "#f76808",
      hasActions: true,
      isExpanded: true,
      children: [
        {
          id: "projects",
          name: "Projects",
          icon: "FolderOpen",
          color: "#5842c8",
          notifications: [{ id: "1", count: 12, type: "info" }],
        },
        {
          id: "meetings",
          name: "Meetings",
          icon: "MessageCircle",
          color: "#35b979",
        },
        {
          id: "research",
          name: "Research",
          icon: "Search",
          color: "#35b979",
          notifications: [{ id: "1", count: 3, type: "info" }],
        },
        {
          id: "releases",
          name: "Releases",
          icon: "Rocket",
          color: "#f76808",
        },
      ],
    },
    {
      id: "brainstud",
      name: "Brainstud",
      icon: "Brain",
      color: "#5842c8",
    },
    {
      id: "remco-stoeten",
      name: "Remco Stoeten",
      icon: "User",
      color: "#2a2a2a",
      isPrivate: true,
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

export function getSidebarData(): Promise<t_sidebar_data> {
  return Promise.resolve(getMockSidebarData())
}

export function getNotificationCount(itemId: string): number {
  const data = getMockSidebarData()
  const item = data.navigationItems.find((item) => item.id === itemId)
  return item?.notifications?.reduce((sum, notif) => sum + notif.count, 0) || 0
}
