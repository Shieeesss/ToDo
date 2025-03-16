import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function will read the token directly from cookies
export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token"); // Get token from cookies directly

  // If there's no token and trying to access the dashboard
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
  }

  return NextResponse.next(); // Allow request to continue
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply this middleware to all paths under /dashboard
};