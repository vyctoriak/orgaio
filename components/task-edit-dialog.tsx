"use client"

import { useState, useEffect } from "react"
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

interface TaskEditDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedTask: Task) => void
}

const availableTags = ["trabalho", "pessoal", "estudo", "saúde", "reunião", "design", "desenvolvimento", "apresentação"]

const tagColors: { [key: string]: string } = {
  trabalho: "bg-blue-500 text-white",
  pessoal: "bg-green-500 text-white",
  estudo: "bg-yellow-500 text-black",
  saúde: "bg-red-500 text-white",
  reunião: "bg-purple-500 text-white",
  design: "bg-pink-500 text-white",
  desenvolvimento: "bg-teal-500 text-white",
  apresentação: "bg-orange-500 text-white",
}

export function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [newTag, setNewTag] = useState("")

  // Resetar o estado quando o modal é aberto com uma nova tarefa
  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        dueDate: task.dueDate ? task.dueDate : undefined,
      })
    }
  }, [task])

  if (!editedTask) return null

  const handleSave = () => {
    onSave(editedTask)
    onOpenChange(false)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedTask.tags.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSelectTag = (tag: string) => {
    if (!editedTask.tags.includes(tag)) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, tag],
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-[#9F5255]/20">
        <DialogHeader>
          <DialogTitle className="text-[#7C444F]">Editar Tarefa</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
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
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
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
                value={editedTask.status}
                onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task["status"] })}
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
                value={editedTask.priority}
                onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as Task["priority"] })}
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
                    !editedTask.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? (
                    format(new Date(editedTask.dueDate), "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                  onSelect={(date) =>
                    setEditedTask({
                      ...editedTask,
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
              {editedTask.tags.map((tag) => (
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
                  .filter((tag) => !editedTask.tags.includes(tag))
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
          <Button onClick={handleSave} className="bg-[#E16A54] hover:bg-[#E16A54]/90">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
