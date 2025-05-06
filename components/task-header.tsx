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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <OrgaioLogo className="h-8 w-8" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7C444F] via-[#E16A54] to-[#F39E60] text-transparent bg-clip-text">
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
              <TabsTrigger
                value="list"
                className={
                  viewMode === "list"
                    ? "bg-slate-100 dark:bg-slate-800 data-[state=active]:bg-slate-400 dark:data-[state=active]:bg-slate-800"
                    : ""
                }
              >
                <List className="h-4 w-4 mr-1" />
                Lista
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className={
                  viewMode === "kanban"
                    ? "bg-slate-100 dark:bg-slate-800 data-[state=active]:bg-slate-400 dark:data-[state=active]:bg-slate-800"
                    : ""
                }
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className={
                  viewMode === "calendar"
                    ? "bg-slate-100 dark:bg-slate-800 data-[state=active]:bg-slate-400 dark:data-[state=active]:bg-slate-800"
                    : ""
                }
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendário
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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
          className="bg-[#E16A54] hover:bg-[#E16A54]/90"
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
