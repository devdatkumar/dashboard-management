// app/api/signup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // ... validate and process signup
  return NextResponse.json({ message: "Signup successful" }, { status: 400 });
}
