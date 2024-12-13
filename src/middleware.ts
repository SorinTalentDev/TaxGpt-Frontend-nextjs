import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken");
  const currentPath = request.nextUrl.pathname;

  // Handle logout scenario: delete the authToken cookie
  if (request.nextUrl.searchParams.has("logout")) {
    console.log("Middleware: Logout detected, deleting authToken cookie.");
    const response = NextResponse.next();
    response.cookies.set("authToken", "", {
      path: "/", // Ensure the path matches the cookie's original path
      httpOnly: true,
      expires: new Date(0), // Set to an expired date
    });
    return response;
  }

  // Handle unauthenticated access
  if (!authToken) {
    // Allow access to login or signup pages without authentication
    if (currentPath === "/login" || currentPath === "/signup") {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to the login page
    const lastUrl = request.nextUrl.href;
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("lastUrl", lastUrl, {
      path: "/",
      httpOnly: true,
      maxAge: 3600, // 1 hour
    });
    return response;
  }

  // Redirect authenticated users away from login or signup pages
  if (authToken && (currentPath === "/login" || currentPath === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Refresh the auth token for authenticated users
  const response = NextResponse.next();
  if (authToken) {
    console.log("Middleware: Refreshing auth token.");
    response.cookies.set("authToken", authToken.value, {
      path: "/",
      httpOnly: true,
      maxAge: 3600, // 1 hour
    });
  }

  return response;
}

// Middleware configuration to exclude certain paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|public/image).*)"],
};
