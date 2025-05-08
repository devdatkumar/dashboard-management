import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyJwt } from "@/lib/jwt";

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

    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const taskList = await db
      .select({
        taskId: tasks.taskId,
        title: tasks.title,
        description: tasks.description,
        userId: tasks.userId,
        status: tasks.status,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks);

    if (!taskList) {
      throw new Error("Failed to retrieve tasks.");
    }

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
