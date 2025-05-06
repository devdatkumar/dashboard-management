import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (pathname.startsWith("/user") && payload.role !== "USER") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
