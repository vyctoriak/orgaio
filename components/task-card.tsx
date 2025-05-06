"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, MoreHorizontal, Edit, Trash, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  overlay?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({
  task,
  overlay = false,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    animateLayoutChanges: () => true,
  });

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200",
    medium:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200",
  };

  const tagColors: Record<string, string> = {
    trabalho: "bg-[#7C444F] text-white",
    pessoal: "bg-[#9F5255] text-white",
    estudo: "bg-[#E16A54] text-white",
    saúde: "bg-[#F39E60] text-white",
    design: "bg-[#7C444F] text-white",
    desenvolvimento: "bg-[#E16A54] text-white",
    reunião: "bg-[#9F5255] text-white",
    apresentação: "bg-[#F39E60] text-white",
  };

  const statusColors = {
    pending: "border-l-[#7C444F]",
    "in-progress": "border-l-[#E16A54]",
    completed: "border-l-[#F39E60]",
  };

  return (
    <motion.div
      layout
      ref={overlay ? undefined : setNodeRef}
      style={style}
      {...(!overlay ? attributes : {})}
      {...(!overlay ? listeners : {})}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { duration: 0.25, type: "spring", stiffness: 500, damping: 30 },
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={cn(
        "bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm border-l-4",
        !overlay && "cursor-grab active:cursor-grabbing",
        "hover:shadow-md transition-all duration-200",
        isDragging && "opacity-30",
        overlay && "shadow-lg border-primary/30 cursor-grabbing",
        statusColors[task.status]
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
          {task.title}
        </h4>
        {!overlay && onEdit && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {task.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={tagColors[tag] || "bg-[#9F5255] text-white"}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <Badge variant="outline" className={priorityColors[task.priority]}>
          {task.priority === "high" && "Alta"}
          {task.priority === "medium" && "Média"}
          {task.priority === "low" && "Baixa"}
        </Badge>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center text-slate-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {format(new Date(task.dueDate), "dd/MM", { locale: ptBR })}
              </span>
            </div>
          )}

          <div className="flex items-center text-slate-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
