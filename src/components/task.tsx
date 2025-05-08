"use client";

import Form from "next/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BadgePlus, CircleAlert, UserRoundCheck } from "lucide-react";
import { useState } from "react";
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

type FieldErrorType = {
  title?: string[] | undefined;
  description?: string[] | undefined;
};

type ResponseType = {
  success?: string;
  failed?: string;
};

const TaskForm = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
  });
  const [fieldError, setFieldError] = useState<FieldErrorType | undefined>({});
  const [responseState, setResponseState] = useState<ResponseType>({});

  const handleAction = async (formData: FormData) => {
    const validationResult = taskSchema.safeParse(Object.fromEntries(formData));

    setFieldError({});
    setResponseState({});

    if (!validationResult.success) {
      setFieldError(validationResult.error.flatten().fieldErrors);
      setTask({
        title: formData.get("title")?.toString() ?? "",
        description: formData.get("description")?.toString() ?? "",
      });
      return;
    }

    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const response = await res.json();
        setResponseState({ failed: response.message });
        setFieldError(response.errors);
        return;
      }

      const response = await res.json();
      setResponseState({ success: response.message });
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
                defaultValue={task.title}
                required
              />
              {fieldError?.title && (
                <ul className="text-red-500 text-sm">
                  {fieldError.title.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Description"
                defaultValue={task.description}
                required
              />
              {fieldError?.description && (
                <ul className="text-red-500 text-sm">
                  {fieldError.description.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  <BadgePlus />
                  Create
                </Button>
              </SheetClose>
            </SheetFooter>
            {responseState.failed && (
              <div className="bg-red-100 text-red-600 border p-3 rounded-md flex items-center gap-x-2 text-sm">
                <CircleAlert />
                <p>{responseState.failed}</p>
              </div>
            )}
            {responseState.success && (
              <div className="bg-green-100 text-green-600 border p-3 rounded-md flex items-center gap-x-2 text-sm">
                <UserRoundCheck />
                <p>{responseState.success}</p>
              </div>
            )}
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskForm;
