import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { taskSchema, taskUpdateSchema } from "@/lib/types/task-schema";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyJwt } from "@/lib/jwt";
import { and, eq } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  try {
    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const taskList = await db
      .select({
        taskId: tasks.taskId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
      })
      .from(tasks)
      .where(eq(tasks.userId, payload.userId));

    const response = NextResponse.json(
      {
        message: "Tasks retrieved!",
        tasks: taskList,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = taskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        message: "Data validation failed",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const { title, description, status } = result.data;

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  try {
    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const [newTask] = await db
      .insert(tasks)
      .values({ userId: payload.userId, title, description, status })
      .returning();

    if (!newTask) {
      throw new Error("Failed to create task.");
    }

    await supabase.channel("task_channel").send({
      type: "broadcast",
      event: "newTask", // Custom event name
      payload: newTask, // Send the new task data as payload
    });

    const response = NextResponse.json(
      {
        message: "Task created!",
        newTask: newTask,
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const body = await req.json();
    const validated = taskUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData = validated.data;

    const result = await db
      .update(tasks)
      .set({ ...updateData })
      .where(and(eq(tasks.taskId, taskId), eq(tasks.userId, payload.userId)))
      .returning({ taskId: tasks.taskId });

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedTask = result[0];
    await supabase.channel("task_channel").send({
      type: "broadcast",
      event: "taskUpdated", // Custom event name
      payload: updatedTask, // Send the updated task data as payload
    });

    return NextResponse.json(
      { message: "Task updated successfully", taskId: result[0].taskId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
