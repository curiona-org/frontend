import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Get the current user
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, data: session });
}
