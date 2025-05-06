"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Task } from "@/lib/types"
import { CalendarIcon } from "lucide-react"

interface TaskCalendarProps {
  tasks: Task[]
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Função para obter tarefas que vencem no dia selecionado
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return []

    return tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate))
  }

  // Função para verificar se uma data tem tarefas com vencimento
  const hasTasksOnDate = (date: Date) => {
    return tasks.some((task) => task.dueDate && isSameDay(new Date(task.dueDate), date))
  }

  const tasksForSelectedDate = getTasksForSelectedDate()

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200",
  }

  const statusColors = {
    pending: "border-l-[#7C444F]",
    "in-progress": "border-l-[#E16A54]",
    completed: "border-l-[#F39E60]",
  }

  const statusLabels = {
    pending: "Pendente",
    "in-progress": "Em Progresso",
    completed: "Concluído",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="rounded-md border border-[#9F5255]/20"
          modifiers={{
            hasTasks: (date) => hasTasksOnDate(date),
          }}
          modifiersClassNames={{
            hasTasks: "font-bold bg-[#E16A54]/10 text-[#7C444F]",
          }}
        />
      </div>

      <div>
        <h3 className="font-medium text-lg mb-4 text-[#7C444F]">
          {selectedDate ? (
            <>Tarefas com vencimento em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</>
          ) : (
            "Selecione uma data"
          )}
        </h3>

        {tasksForSelectedDate.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-[#9F5255]/50" />
            <p>Nenhuma tarefa com vencimento para esta data.</p>
            <p className="text-sm mt-1">Selecione outra data ou adicione tarefas com este prazo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksForSelectedDate.map((task) => (
              <Card key={task.id} className={`border-l-4 ${statusColors[task.status]}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span
                          className={`text-xs ${task.status === "pending" ? "text-[#7C444F]" : task.status === "in-progress" ? "text-[#E16A54]" : "text-[#F39E60]"}`}
                        >
                          {statusLabels[task.status]}
                        </span>
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                          {task.priority === "high" && "Alta"}
                          {task.priority === "medium" && "Média"}
                          {task.priority === "low" && "Baixa"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
