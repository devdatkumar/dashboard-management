import { timestamp, pgTable, text, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    userId: text("user_id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: text("role").$type<"ADMIN" | "USER">().notNull().default("USER"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (user) => [index("email_idx").on(user.email), index("role_idx").on(user.role)]
);
