import TaskBoard from "@/components/task-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orgaio - Gerenciador de Tarefas Inteligente",
  description: "Organize suas tarefas de forma visual e intuitiva",
};

export default function Home() {
  return (
    <main>
      <TaskBoard />
    </main>
  );
}
