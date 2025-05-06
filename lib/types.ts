export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  tags: string[]
  createdAt: string
  dueDate?: string
  subtasks?: Subtask[]
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}
