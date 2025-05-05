import { db } from "./index";
import { tasks, users } from "./schema";
import { eq } from "drizzle-orm";

export async function taskSeed() {
  try {
    const [result] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.email, "456@email.com"))
      .limit(1);

    console.log("this is the user id", result.userId);

    const task = {
      taskId: crypto.randomUUID(),
      userId: result.userId,
      title: "Complete Admin Dashboard",
      description: "Build the task management section of the admin dashboard.",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(tasks).values(task);
    console.log("New task created!");

    const allTasks = await db.select().from(tasks);
    console.log("Getting all tasks from the database: ", allTasks);

    await db
      .update(tasks)
      .set({
        completed: true,
        updatedAt: new Date(),
      })
      .where(eq(tasks.taskId, task.taskId));
    console.log("Task completion status updated!");

    // await db.delete(tasks).where(eq(tasks.taskId, task.taskId));
    // console.log("Task deleted!");
  } catch (error) {
    console.error("Error during task seeding:", error);
  }
}
