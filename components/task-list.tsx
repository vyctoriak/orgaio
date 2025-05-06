"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, Tag, ChevronDown, ChevronUp, Calendar, MoreHorizontal, Edit, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, completed: boolean) => void
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  const tagColors = {
    trabalho: "bg-[#7C444F] text-white",
    pessoal: "bg-[#9F5255] text-white",
    estudo: "bg-[#E16A54] text-white",
    saúde: "bg-[#F39E60] text-white",
    design: "bg-[#7C444F] text-white",
    desenvolvimento: "bg-[#E16A54] text-white",
    reunião: "bg-[#9F5255] text-white",
    apresentação: "bg-[#F39E60] text-white",
  }

  const statusColors = {
    pending: "text-[#7C444F] border-l-[#7C444F]",
    "in-progress": "text-[#E16A54] border-l-[#E16A54]",
    completed: "text-[#F39E60] border-l-[#F39E60]",
  }

  const statusLabels = {
    pending: "Pendente",
    "in-progress": "Em Progresso",
    completed: "Concluído",
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Nenhuma tarefa encontrada. Tente ajustar sua busca ou adicione uma nova tarefa.
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "py-4 transition-colors border-l-4 pl-4",
            task.status === "completed" && "bg-slate-50/50 dark:bg-slate-800/50",
            statusColors[task.status],
          )}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.status === "completed"}
              className="mt-1"
              onCheckedChange={(checked) => onStatusChange(task.id, checked as boolean)}
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      "font-medium text-slate-800 dark:text-slate-200 cursor-pointer",
                      task.status === "completed" && "line-through text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {task.title}
                  </label>

                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className={statusColors[task.status]}>{statusLabels[task.status]}</span>

                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}

                    <Badge variant="outline" className={priorityColors[task.priority]}>
                      {task.priority === "high" && "Alta"}
                      {task.priority === "medium" && "Média"}
                      {task.priority === "low" && "Baixa"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 dark:text-red-400">
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={() => toggleTaskExpanded(task.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {expandedTasks[task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {expandedTasks[task.id] && (
                <div className="mt-3 pl-1 text-sm text-slate-600 dark:text-slate-300 space-y-3">
                  {task.description && <p>{task.description}</p>}

                  {task.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className={tagColors[tag] || "bg-[#9F5255] text-white"}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
