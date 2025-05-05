import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const client = postgres(connectionString, {
  max: 1,
  prepare: false,
  ssl: process.env.NODE_ENV === "production" ? "prefer" : false, //change from "prefer" to "require" or "verify-full"
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV !== "production",
  casing: "snake_case",
});

const allUsers = await db.select().from(schema.users); // remove this after testing
console.log("All users: ", allUsers); // remove this after testing

export const closeDbConnection = () => {
  client.end();
};
