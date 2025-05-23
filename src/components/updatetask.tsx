"use client";

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
import { Check, PencilLine } from "lucide-react";
import Form from "next/form";

type Task = {
  taskId?: string;
  title?: string;
  description?: string;
  status?: boolean;
};

type UpdateTaskFormProps = Task & {
  updateTask: (updatedFields: Task) => Promise<void>;
};

const UpdateTaskForm = ({
  taskId,
  title,
  description,
  updateTask,
}: UpdateTaskFormProps) => {
  const handleAction = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    updateTask({ taskId, ...data });
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
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  <Check className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateTaskForm;
