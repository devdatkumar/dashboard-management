import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { signinSchema } from "@/lib/types/auth-schema";
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import bcryptjs from "bcryptjs";

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

    const token = await signJwt({ userId: user.userId, role: user.role });

    const response = NextResponse.json(
      {
        message: "Sign in success!",
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
