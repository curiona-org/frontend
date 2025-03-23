import {
  getSession,
  isSessionExpired,
  refreshSession,
  shouldRefreshToken,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in",
  "/api/auth/sign-in",
  "/api/auth/sign-in/google",
  "/api/auth/sign-in/google/callback",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  try {
    const session = await getSession(request);

    if (!session && !publicRoutes.includes(pathname)) {
      const signInURL = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInURL);
    }

    if (session?.tokens && shouldRefreshToken(session, 5 * 60 * 1000)) {
      const newSession = await refreshSession(response, session);

      if (!newSession) {
        const signInURL = new URL("/sign-in", request.url);
        return NextResponse.redirect(signInURL);
      }
    } else if (isSessionExpired(session) && !publicRoutes.includes(pathname)) {
      const signInURL = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInURL);
    }
  } catch {
    // If we're not on a public route, redirect to sign-in
    if (!publicRoutes.includes(pathname)) {
      const signInURL = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInURL);
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
