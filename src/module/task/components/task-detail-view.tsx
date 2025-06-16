"use client"

type TaskDetailViewProps = {
  taskId: string
}

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>
      <p className="text-[#b4b4b4]">Task ID: {taskId}</p>
      <div className="mt-8 p-4 bg-[#2a2a2a] rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Task Information</h2>
        <p className="text-sm text-[#b4b4b4]">Detailed task view and editing interface will be implemented here.</p>
      </div>
    </div>
  )
}
