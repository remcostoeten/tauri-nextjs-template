import { useState } from "react"

type Project = {
  id: string
  name: string
  avatar?: string
  color: string
}

export function useProjects() {
  const [currentProject] = useState<Project>({
    id: "1",
    name: "Personal Workspace",
    color: "#f76808",
  })

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Personal Workspace",
      color: "#f76808",
    },
    {
      id: "2",
      name: "Team Workspace",
      color: "#00b8d4",
    },
  ])

  const setCurrentProject = (project: Project) => {
    console.log("Setting current project:", project)
    // Implement this when you have real data
  }

  const createProject = async (name: string) => {
    console.log("Creating project:", name)
    // Implement this when you have real data
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    console.log("Updating project:", id, data)
    // Implement this when you have real data
  }

  const deleteProject = async (id: string) => {
    console.log("Deleting project:", id)
    // Implement this when you have real data
  }

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    isLoading: false,
    error: null,
  }
} 