import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/lib/types";

interface TaskState {
  tasks: Task[];
  isLoaded: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, completed: boolean) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  moveTaskToStatus: (taskId: string, newStatus: Task["status"]) => void;
  setTasks: (newTasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      isLoaded: false,

      addTask: (newTask) => {
        const taskWithId: Task = {
          ...newTask,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, taskWithId] }));
      },

      updateTask: (updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      updateTaskStatus: (taskId, completed) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: completed ? "completed" : "pending" }
              : task
          ),
        }));
      },

      reorderTasks: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.tasks);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { tasks: result };
        });
      },

      moveTaskToStatus: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        }));
      },

      setTasks: (newTasks) => set({ tasks: newTasks }),
    }),
    {
      name: "orgaio-tasks", // nome da chave no localStorage
      onRehydrateStorage: () => (state) => {
        // Quando os dados são reidratados do localStorage
        if (state) {
          state.isLoaded = true;
        }
      },
    }
  )
);
