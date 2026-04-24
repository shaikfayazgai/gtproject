import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedRoutes = ["/enterprise", "/contributor", "/mentor"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/login", "/auth/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const forceRelogin = req.nextUrl.searchParams.get("relogin") === "1";

  // Use getToken (Edge-compatible) instead of importing auth (which pulls in bcryptjs)
  let isLoggedIn = false;
  let userRole = "contributor";
  try {
    // secureCookie must be true on HTTPS (Vercel) so getToken reads
    // "__Secure-authjs.session-token" instead of "authjs.session-token"
    const secureCookie = req.nextUrl.protocol === "https:";
    const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie });
    // Valid session: Auth.js may expose `sub`, custom `id`, and/or `email` depending on provider / version.
    const t = token as Record<string, unknown> | null;
    isLoggedIn = !!(t?.email || t?.sub || t?.id);
    userRole = (token?.role as string) || "contributor";
  } catch {
    isLoggedIn = false;
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes (role-based)
  // Allow explicit relogin links (e.g. reviewer invite email) even when another
  // user is already authenticated in the same browser session.
  if (isAuthRoute && isLoggedIn && !(pathname.startsWith("/auth/login") && forceRelogin)) {
    const dashboardMap: Record<string, string> = {
      contributor: "/contributor/dashboard",
      mentor: "/mentor/dashboard",
      admin: "/enterprise/dashboard",
      enterprise: "/enterprise/dashboard",
      reviewer: "/enterprise/reviewer",
    };
    const dest = dashboardMap[userRole] || "/enterprise/dashboard";
    return NextResponse.redirect(new URL(dest, req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
