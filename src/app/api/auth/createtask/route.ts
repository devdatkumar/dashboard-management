import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { taskSchema } from "@/lib/types/task-schema";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyJwt } from "@/lib/jwt";

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

    let { userId } = payload;
    const [newTask] = await db
      .insert(tasks)
      .values({ userId, title, description, status })
      .returning({
        taskId: tasks.taskId,
      });

    if (!newTask) {
      throw new Error("Failed to create user.");
    }

    const response = NextResponse.json(
      {
        message: "Task created!",
        taskId: newTask.taskId,
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
