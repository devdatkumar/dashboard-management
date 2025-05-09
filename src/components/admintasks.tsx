"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRealtimeTasks } from "@/lib/useRealtimeTasks";

type Task = {
  taskId: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export default function AdminTask() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      const response = await res.json();
      if (!res.ok) {
        toast.error(`${response.message}`);
        return;
      }

      toast.success(`${response.message}`);
      setTasks(response.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  useRealtimeTasks((event) => {
    if (event.type === "newTask") {
      fetchTasks();
      toast.info("New Task Added");
    } else if (event.type === "taskUpdated") {
      toast.info("Task Updated");
      fetchTasks();
    }
  });

  return (
    <div className="border-2 rounded-md overflow-hidden mx-2 mt-2">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="border-t border-2 p-3 hover:bg-muted/10 transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium">
                <span className="font-medium">Title: </span>
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Description: </span>
                {task.description}
              </p>
            </div>

            <div>
              <div>
                <div className="text-sm gap-1">
                  <span className="font-medium ">Created by: </span>
                  <span>{task.userId}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Created: </span>
                  {task.createdAt && new Date(task.createdAt).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Updated: </span>
                  {task.updatedAt && new Date(task.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <Badge className={task.status ? "bg-green-500" : "bg-yellow-500"}>
                {task.status ? "Complete" : "Incomplete"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
