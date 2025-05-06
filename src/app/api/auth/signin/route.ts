import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { signinSchema } from "@/lib/types/auth-schema";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const body = await req.json();

  const result = signinSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        message: "Data validation failed",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 409 }
    );
  }
  const { email, password } = result.data;

  // Retrieve user data from existing user
  try {
    const [user] = await db
      .select({
        userId: users.userId,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user || !user.password) {
      throw new Error("User not found!");
    }

    // validate credentials
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentails!");
    }

    const token = signJwt({ userId: user.userId, role: user.role });

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json(
      {
        message: "User Created successfully",
      },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", cookie);

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
