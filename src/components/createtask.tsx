"use client";

import Form from "next/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BadgePlus } from "lucide-react";
import { taskSchema } from "@/lib/types/task-schema";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { toast } from "sonner";

type Task = {
  taskId?: string;
  title?: string;
  description?: string;
  status?: boolean;
};

const CreateTask = ({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const handleAction = async (formData: FormData) => {
    const validationResult = taskSchema.safeParse(Object.fromEntries(formData));
    if (!validationResult.success) {
      toast.error("Validation failed");
      return;
    }

    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok) {
        toast.error(`${response.message}`);
        return;
      }

      setTasks((prevTasks) => [...prevTasks, response.newTask]);
      toast.success("Task created successfully");
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-blue-500">Create Task</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Task Form</SheetTitle>
          <SheetDescription>Fill in the task details below.</SheetDescription>
        </SheetHeader>
        <Form action={handleAction}>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Description"
                required
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  <BadgePlus />
                  Create
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateTask;
