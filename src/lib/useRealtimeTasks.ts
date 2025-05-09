import { useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface Task {
  taskId: string;
  userId: string;
  title: string;
  description: string | null;
  status: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type RealtimeEvent =
  | { type: "newTask"; data: Task }
  | { type: "taskUpdated"; data: Task };

export function useRealtimeTasks(callback: (event: RealtimeEvent) => void) {
  useEffect(() => {
    const channel = supabase.channel("task_channel");

    channel
      .on("broadcast", { event: "newTask" }, (payload) => {
        callback({ type: "newTask", data: payload.payload });
      })
      .on("broadcast", { event: "taskUpdated" }, (payload) => {
        callback({ type: "taskUpdated", data: payload.payload });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
}
