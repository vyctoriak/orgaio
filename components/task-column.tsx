"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "@/components/task-card";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import React from "react";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  activeId?: string | null;
  overId?: string | null;
}

export function TaskColumn({
  id,
  title,
  tasks,
  color,
  onEdit,
  onDelete,
  activeId,
  overId,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Calcule o índice onde o placeholder deve aparecer
  const placeholderIndex = useMemo(() => {
    if (!activeId || !overId) return -1;
    // Se o mouse está sobre a coluna (overId é o id da coluna), placeholder no final
    if (overId === id) return tasks.length;
    // Se está sobre algum card, placeholder na posição desse card
    const idx = tasks.findIndex((task) => task.id === overId);
    return idx >= 0 ? idx : -1;
  }, [activeId, overId, id, tasks]);

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
          {tasks.map((task, idx) => (
            <React.Fragment key={task.id}>
              {placeholderIndex === idx && (
                <div
                  key={`placeholder-${idx}`}
                  className="h-[88px] bg-primary/10 rounded-md border-2 border-dashed border-primary/40 transition-all duration-200"
                />
              )}
              <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
            </React.Fragment>
          ))}
          {/* Se for soltar no fim da coluna */}
          {placeholderIndex === tasks.length && (
            <div
              key="placeholder-end"
              className="h-[88px] bg-primary/10 rounded-md border-2 border-dashed border-primary/40 transition-all duration-200"
            />
          )}
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
