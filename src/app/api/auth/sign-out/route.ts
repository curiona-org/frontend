import { handleCurionaError } from "@/lib/error";
import { getSession, SESSION_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      });
    }

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in",
      },
    });
  } catch (error) {
    const err = handleCurionaError(error);
    console.error("Error signing out:", err);

    return NextResponse.error();
  }
}
