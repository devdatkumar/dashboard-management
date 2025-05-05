import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { taskSeed } from "./taskseed";

export async function userSeed() {
  try {
    const user: typeof users.$inferInsert = {
      password: "pass123",
      email: "456@email.com",
      role: "ADMIN",
    };

    const [existingUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, user.email));

    if (!existingUser) {
      await db.insert(users).values(user);
      console.log("New user created!");
    } else {
      console.log("User already exists, skipping creation.");
    }

    const allUsers = await db.select().from(users);
    console.log("Getting all users from the database: ", ...allUsers);

    await db
      .update(users)
      .set({
        password: "1234",
      })
      .where(eq(users.email, user.email));
    console.log("User info updated!");

    await taskSeed();

    // await db.delete(users).where(eq(users.email, user.email));
    // console.log("User deleted!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
