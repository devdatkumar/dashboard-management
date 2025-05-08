"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Edit3 } from "lucide-react";
import UpdateTaskForm from "./updatetask";

type Task = {
  taskId?: string;
  title?: string;
  description?: string;
  status?: boolean;
};

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");

        if (!res.ok) {
          const response = await res.json();
          return;
        }

        const response = await res.json();
        setTasks(response.tasks || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [tasks]);

  const updateTask = async (updatedFields: Task) => {
    try {
      const res = await fetch(`/api/tasks/${updatedFields.taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.taskId === updatedFields.taskId
              ? { ...task, ...updatedFields }
              : task
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden mx-2 mt-2">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="border-t p-3 hover:bg-muted/10 transition-colors"
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

            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <Badge className={task.status ? "bg-green-500" : "bg-yellow-500"}>
                {task.status ? "Complete" : "Incomplete"}
              </Badge>
            </div>

            {!task.status && (
              <div className="flex justify-end items-center space-x-2 border rounded-md md:border-none p-2">
                <UpdateTaskForm
                  taskId={task.taskId}
                  title={task.title}
                  description={task.description}
                  setTasks={setTasks}
                />
                <Button
                  variant="outline"
                  className="h-8"
                  onClick={() =>
                    updateTask({
                      taskId: task.taskId,
                      status: !task.status,
                    })
                  }
                >
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
