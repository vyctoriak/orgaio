"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { initialTasks } from "@/lib/data"

export function useTasks() {
  // Inicializa o estado com um valor vazio e depois carrega do localStorage
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega as tarefas do localStorage quando o componente é montado
  useEffect(() => {
    const storedTasks = localStorage.getItem("orgaio-tasks")
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks))
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error)
        setTasks(initialTasks) // Usa as tarefas iniciais em caso de erro
      }
    } else {
      setTasks(initialTasks) // Usa as tarefas iniciais se não houver nada no localStorage
    }
    setIsLoaded(true)
  }, [])

  // Salva as tarefas no localStorage sempre que elas mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orgaio-tasks", JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  // Função para adicionar uma nova tarefa
  const addTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTasks((prevTasks) => [...prevTasks, taskWithId])
  }

  // Função para atualizar uma tarefa existente
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  // Função para excluir uma tarefa
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  // Função para alterar o status de uma tarefa
  const updateTaskStatus = (taskId: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: completed ? "completed" : "pending" } : task)),
    )
  }

  // Função para reordenar tarefas (para drag and drop)
  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks((prevTasks) => {
      const result = Array.from(prevTasks)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  // Função para mover uma tarefa para outro status
  const moveTaskToStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    reorderTasks,
    moveTaskToStatus,
    isLoaded,
  }
}
