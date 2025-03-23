import { handleCurionaError } from "@/lib/error";
import { decrypt } from "@/lib/helpers/crypto.helper";
import { getSession, refreshSession, Session } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.redirect("/sign-in");
    }

    const newSessionPayload = await refreshSession(response, session);
    if (!newSessionPayload) {
      return NextResponse.json(
        { success: false, message: "Failed to refresh session" },
        { status: 500 }
      );
    }

    // TODO: should not decrypt here, should be somewhere else
    const newSession = await decrypt<Session>(newSessionPayload);

    if (!newSession) {
      return NextResponse.json(
        { success: false, message: "Failed to refresh session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    const err = handleCurionaError(error);
    console.error("Error refreshing session:", err);

    return NextResponse.json(
      { success: false, message: err.message || "Failed to refresh session" },
      { status: err.statusCode }
    );
  }
}
