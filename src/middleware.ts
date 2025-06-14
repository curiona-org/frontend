import { config as appConfig } from "@/lib/config";
import {
  getSession,
  isSessionExpired,
  shouldRefreshToken,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { refreshSessionAction, signOutAction } from "./app/(auth)/actions";
import { handleCurionaError } from "./lib/error";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/sign-in/callback/google",
  "/roadmap",
];

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const signInURL = new URL("/sign-in", request.url);

  // If the request is for a public route, skip authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return response;
  }

  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.redirect(signInURL);
    }

    // refresh token before it's expiry (24 hours)
    if (
      session?.tokens &&
      shouldRefreshToken(session, appConfig.SESSION_EXPIRY_MS - 60 * 60 * 1000) // 1 hour before expiry
    ) {
      const refreshResult = await refreshSessionAction();
      if (!refreshResult.success) {
        return NextResponse.redirect(signInURL);
      }

      return response;
    }

    if (isSessionExpired(session)) {
      await signOutAction();
      return NextResponse.redirect(signInURL);
    }
  } catch (error) {
    const err = handleCurionaError(error);
    console.error("[MIDDLEWARE] Error:", err);
    await signOutAction();
    return NextResponse.redirect(signInURL);
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
