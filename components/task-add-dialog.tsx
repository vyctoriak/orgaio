"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TaskAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void
}

const availableTags = ["trabalho", "pessoal", "estudo", "saúde", "reunião", "design", "desenvolvimento", "apresentação"]

const tagColors: { [key: string]: string } = {
  trabalho: "bg-[#7C444F] text-white",
  pessoal: "bg-[#9F5255] text-white",
  estudo: "bg-[#E16A54] text-white",
  saúde: "bg-[#F39E60] text-white",
  reunião: "bg-[#9F5255] text-white",
  design: "bg-[#7C444F] text-white",
  desenvolvimento: "bg-[#E16A54] text-white",
  apresentação: "bg-[#F39E60] text-white",
}

export function TaskAddDialog({ open, onOpenChange, onAdd }: TaskAddDialogProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt">>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    tags: [],
  })
  const [newTag, setNewTag] = useState("")

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      tags: [],
    })
    setNewTag("")
  }

  const handleAdd = () => {
    if (newTask.title.trim()) {
      onAdd(newTask)
      resetForm()
      onOpenChange(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newTask.tags.includes(newTag.trim())) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSelectTag = (tag: string) => {
    if (!newTask.tags.includes(tag)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tag],
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px] border-[#9F5255]/20">
        <DialogHeader>
          <DialogTitle className="text-[#7C444F]">Adicionar Nova Tarefa</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Título da tarefa"
              className="border-[#9F5255]/20 focus-visible:ring-[#E16A54]/30"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Descrição da tarefa"
              rows={3}
              className="border-[#9F5255]/20 focus-visible:ring-[#E16A54]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
              >
                <SelectTrigger id="status" className="border-[#9F5255]/20 focus:ring-[#E16A54]/30">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending" className="text-[#7C444F]">
                    Pendente
                  </SelectItem>
                  <SelectItem value="in-progress" className="text-[#E16A54]">
                    Em Progresso
                  </SelectItem>
                  <SelectItem value="completed" className="text-[#F39E60]">
                    Concluído
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridade
              </label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
              >
                <SelectTrigger id="priority" className="border-[#9F5255]/20 focus:ring-[#E16A54]/30">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Data de Vencimento
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-[#9F5255]/20",
                    !newTask.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTask.dueDate ? (
                    format(new Date(newTask.dueDate), "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                  onSelect={(date) =>
                    setNewTask({
                      ...newTask,
                      dueDate: date ? date.toISOString() : undefined,
                    })
                  }
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newTask.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`gap-1 pr-1 ${tagColors[tag] || "bg-[#9F5255] text-white"}`}
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="border-[#9F5255]/20 focus-visible:ring-[#E16A54]/30"
              />
              <Button type="button" size="icon" onClick={handleAddTag} className="bg-[#E16A54] hover:bg-[#E16A54]/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Tags sugeridas:</p>
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter((tag) => !newTask.tags.includes(tag))
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary/20"
                      onClick={() => handleSelectTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#9F5255]/20">
            Cancelar
          </Button>
          <Button onClick={handleAdd} className="bg-[#E16A54] hover:bg-[#E16A54]/90" disabled={!newTask.title.trim()}>
            Adicionar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
