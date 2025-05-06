"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Calendar, LayoutGrid, List } from "lucide-react";
import { OrgaioLogo } from "@/components/orgaio-logo";
import { TaskAddDialog } from "@/components/task-add-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Task } from "@/lib/types";

interface TaskHeaderProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  viewMode: "list" | "kanban" | "calendar";
  onViewModeChange: (mode: "list" | "kanban" | "calendar") => void;
}

export function TaskHeader({
  onAddTask,
  onSearch,
  searchQuery,
  viewMode,
  onViewModeChange,
}: TaskHeaderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <OrgaioLogo className="h-8 w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7C444F] via-[#E16A54] to-[#F39E60] text-transparent bg-clip-text">
            Orgaio
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(value) =>
              onViewModeChange(value as "list" | "kanban" | "calendar")
            }
          >
            <TabsList className="bg-[#7C444F]/10">
              <TabsTrigger value="list" className="px-2 sm:px-3">
                <List className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="px-2 sm:px-3">
                <LayoutGrid className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="px-2 sm:px-3">
                <Calendar className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Calendário</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-10 border-[#9F5255]/20 focus-visible:ring-[#E16A54]/30"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#E16A54] hover:bg-[#E16A54]/90 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Tarefa
        </Button>
      </div>

      <TaskAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={onAddTask}
      />
    </div>
  );
}
