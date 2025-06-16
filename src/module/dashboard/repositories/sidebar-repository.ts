type TSidebarData = {

  currentWorkspace: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  };
  workspaces: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  }[];
  navigationItems: {
    id: string;
    title: string;
    icon: string;
    href: string;
    isActive: boolean;
  }[];
};


export async function getSidebarData(): Promise<TSidebarData> {
  return {
    currentWorkspace: {
      id: "1",
      name: "Personal Workspace",
      avatar: "",
      color: "#f76808",
    },
    workspaces: [
      {
        id: "1",
        name: "Personal Workspace",
        avatar: "",
        color: "#f76808",
      },
      {
        id: "2",
        name: "Team Workspace",
        avatar: "",
        color: "#00b8d4",
      },
    ],
    navigationItems: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "Home",
        href: "/dashboard",
        isActive: true,
      },
      {
        id: "tasks",
        title: "Tasks",
        icon: "CheckSquare",
        href: "/dashboard/tasks",
      },
      {
        id: "projects",
        title: "Projects",
        icon: "FileText",
        href: "/dashboard/projects",
      },
      {
        id: "calendar",
        title: "Calendar",
        icon: "Calendar",
        href: "/dashboard/calendar",
      },
      {
        id: "messages",
        title: "Messages",
        icon: "MessageSquare",
        href: "/dashboard/messages",
        notifications: [{ id: "1", count: 3, type: "info" }],
      },
    ],
    favorites: [
      {
        id: "docs",
        title: "Documentation",
        icon: "Book",
        href: "/docs",
      },
      {
        id: "settings",
        title: "Settings",
        icon: "Settings",
        href: "/settings",
      },
    ],
    spaces: [
      {
        id: "product-team",
        name: "Product Team",
        icon: "Rocket",
        color: "#00b8d4",
        children: [
          {
            id: "roadmap",
            name: "Roadmap",
            icon: "Target",
            color: "#00bfa5",
          },
          {
            id: "design",
            name: "Design",
            icon: "Presentation",
            color: "#00bfa5",
          },
        ],
      },
      {
        id: "engineering",
        name: "Engineering",
        icon: "Database",
        color: "#f76808",
        isPrivate: true,
        notifications: [{ id: "1", count: 2, type: "warning" }],
      },
      {
        id: "marketing",
        name: "Marketing",
        icon: "Globe",
        color: "#7c4dff",
      },
    ],
    isCollapsed: false,
  }
} 