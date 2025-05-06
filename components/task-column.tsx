"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "@/components/task-card";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskColumn({
  id,
  title,
  tasks,
  color,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg shadow-sm p-4 border transition-all duration-200",
        isOver &&
          "ring-2 ring-offset-2 ring-offset-background ring-primary/40 shadow-md",
        `bg-[${color}]/5 border-[${color}]/20`
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-medium text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[100px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {isOver && tasks.length === 0 && (
            <div className="border-2 border-dashed border-primary/30 rounded-md h-24 flex items-center justify-center text-sm text-slate-400">
              Solte aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
