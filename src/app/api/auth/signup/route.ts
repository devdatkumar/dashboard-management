import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { signupSchema } from "@/lib/types/auth-schema";
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();

  const result = signupSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        message: "Data validation failed",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 409 }
    );
  }

  const { email, password, role } = result.data;

  try {
    // Check existing user
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new Error("User already exists!");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        userId: users.userId,
        role: users.role,
      });

    if (!newUser) {
      throw new Error("Failed to create user.");
    }

    const token = await signJwt({ userId: newUser.userId, role: newUser.role });

    const response = NextResponse.json(
      {
        message: "User Created successfully",
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 400 }
    );
  }
}
