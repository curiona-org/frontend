import { handleCurionaError } from "@/lib/error";
import { getSession, SESSION_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.redirect("/sign-in");
    }

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    const err = handleCurionaError(error);
    console.error("Error signing out:", err);

    return NextResponse.json(
      { success: false, message: err.message || "Failed to sign out" },
      { status: err.statusCode || 500 }
    );
  }
}
