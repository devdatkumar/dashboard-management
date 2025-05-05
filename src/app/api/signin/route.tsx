// app/api/signup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: "Signin successful" }, { status: 400 });
}
