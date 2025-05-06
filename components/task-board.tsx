"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskColumn } from "@/components/task-column";
import { TaskHeader } from "@/components/task-header";
import { TaskCard } from "@/components/task-card";
import { TaskList } from "@/components/task-list";
import { TaskCalendar } from "@/components/task-calendar";
import { TaskEditDialog } from "@/components/task-edit-dialog";
import { useTaskStore } from "@/lib/store/task-store";
import type { Task } from "@/lib/types";

export default function TaskBoard() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    moveTaskToStatus,
    isLoaded,
  } = useTaskStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "calendar">(
    "kanban"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Adicionar event listeners para edição e exclusão de tarefas
  useEffect(() => {
    const handleEditTask = (event: CustomEvent<Task>) => {
      setEditingTask(event.detail);
      setIsEditDialogOpen(true);
    };

    const handleDeleteTask = (event: CustomEvent<string>) => {
      deleteTask(event.detail);
    };

    window.addEventListener("edit-task", handleEditTask as EventListener);
    window.addEventListener("delete-task", handleDeleteTask as EventListener);

    return () => {
      window.removeEventListener("edit-task", handleEditTask as EventListener);
      window.removeEventListener(
        "delete-task",
        handleDeleteTask as EventListener
      );
    };
  }, [deleteTask]);

  // Filtrar tarefas com base na busca
  const filteredTasks = tasks.filter(
    (task) =>
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const pendingTasks = filteredTasks.filter(
    (task) => task.status === "pending"
  );
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed"
  );

  const mouseSensor = useSensor(MouseSensor, {
    // Aumentar a distância de ativação para evitar cliques acidentais
    activationConstraint: {
      distance: 5, // 5px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Aumentar o delay para evitar ativações acidentais em dispositivos touch
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Reordenar tarefas
        const newTasks = arrayMove(tasks, activeIndex, overIndex);
        // Como estamos usando o hook useTasks, não precisamos mais chamar setTasks diretamente
        // Em vez disso, atualizamos cada tarefa individualmente
        newTasks.forEach((task, index) => {
          if (JSON.stringify(task) !== JSON.stringify(tasks[index])) {
            updateTask(task);
          }
        });
      }
    }

    // Handle moving between columns
    const taskId = active.id as string;
    const overId = over.id as string;

    if (overId.includes("column")) {
      const newStatus = overId.replace("column-", "");
      moveTaskToStatus(taskId, newStatus as Task["status"]);
    }
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  }

  // Se ainda não carregou, podemos mostrar um indicador de carregamento
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E16A54]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskHeader
        onAddTask={addTask}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "kanban" && (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          autoScroll={{
            threshold: {
              x: 0.1,
              y: 0.25,
            },
            speed: {
              x: 10,
              y: 10,
            },
          }}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <TaskColumn
                id="column-pending"
                title="Pendente"
                tasks={pendingTasks}
                color="#7C444F"
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
              <TaskColumn
                id="column-in-progress"
                title="Em Progresso"
                tasks={inProgressTasks}
                color="#E16A54"
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
              <TaskColumn
                id="column-completed"
                title="Concluído"
                tasks={completedTasks}
                color="#F39E60"
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </div>
          </SortableContext>

          <DragOverlay adjustScale={false} zIndex={999}>
            {activeId ? (
              <div className="transform rotate-1 shadow-lg">
                <TaskCard
                  task={tasks.find((task) => task.id === activeId)!}
                  overlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {viewMode === "list" && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <TaskCalendar tasks={filteredTasks} />
        </div>
      )}

      <TaskEditDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={updateTask}
      />
    </div>
  );
}
