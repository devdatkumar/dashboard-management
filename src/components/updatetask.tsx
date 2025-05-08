"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
import { Check, CircleAlert, PencilLine } from "lucide-react";
import Form from "next/form";

type Task = {
  taskId?: string;
  title?: string;
  description?: string;
};

type UpdateTaskFormProps = Task & {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

type FieldErrorType = {
  title?: string[] | undefined;
  description?: string[] | undefined;
};

type ResponseType = {
  success?: string;
  failed?: string;
};

const UpdateTaskForm = ({
  taskId,
  title,
  description,
  setTasks,
}: UpdateTaskFormProps) => {
  const [fieldError, setFieldError] = useState<FieldErrorType | undefined>({});
  const [responseState, setResponseState] = useState<ResponseType>({});

  const handleAction = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData);
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const response = await res.json();
        setResponseState(response.message);
        return;
      }

      const response = await res.json();

      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === response.taskId ? { ...task, ...response } : task
        )
      );
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-8">
          <PencilLine className="mr-2 h-4 w-4" /> Edit Task
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details below.</SheetDescription>
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
                defaultValue={title ?? ""}
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
                defaultValue={description ?? ""}
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
                  <Check className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </SheetClose>
            </SheetFooter>
            {responseState.failed && (
              <div className="bg-red-100 text-red-600 border p-3 rounded-md text-sm flex gap-2 items-center">
                <CircleAlert />
                {responseState.failed}
              </div>
            )}
            {responseState.success && (
              <div className="bg-green-100 text-green-600 border p-3 rounded-md text-sm flex gap-2 items-center">
                <Check />
                {responseState.success}
              </div>
            )}
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateTaskForm;
