import { TaskDetailView } from "../../../components/task-detail-view"

type TaskDetailPageProps = {
  params: { id: string }
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  return <TaskDetailView taskId={params.id} />
}
