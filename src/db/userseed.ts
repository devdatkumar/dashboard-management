import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function userSeed() {
  try {
    const user: typeof users.$inferInsert = {
      userId: "123",
      password: "pass123",
      email: "123@email.com",
      role: "ADMIN",
    };

    await db.insert(users).values(user);
    console.log("New user created!");

    const allUsers = await db.select().from(users);
    console.log("Getting all users from the database: ", allUsers);

    await db
      .update(users)
      .set({
        password: "1234",
      })
      .where(eq(users.email, user.email));
    console.log("User info updated!");

    await db.delete(users).where(eq(users.email, user.email));
    console.log("User deleted!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
