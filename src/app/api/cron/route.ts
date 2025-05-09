// src/app/api/cron/reminders/route.ts
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { lt, eq, and } from "drizzle-orm";
import { subDays } from "date-fns";

export async function GET() {
  const yesterday = subDays(new Date(), 1);

  const incompleteTasks = await db
    .select()
    .from(tasks)
    .where(and(lt(tasks.createdAt, yesterday), eq(tasks.status, false)));

  console.log(`📢 Found ${incompleteTasks.length} old incomplete tasks`);

  incompleteTasks.forEach((task) => {
    console.log(`🔔 Reminder: Task "${task.title}" is still incomplete.`);
  });

  return new Response(
    JSON.stringify({
      message: "Reminders checked",
      count: incompleteTasks.length,
    }),
    { status: 200 }
  );
}
