import { timestamp, pgTable, text, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tasks = pgTable(
  "task",
  {
    taskId: text("task_id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  },
  (task) => [index("user_idx").on(task.userId)]
);
