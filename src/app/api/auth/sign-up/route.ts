import { handleCurionaError } from "@/lib/error";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { AuthService } from "@/lib/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const { data } = await authService.register({ name, email, password });

    const cookieStore = await cookies();

    const session = await encrypt({
      tokens: {
        access_token: data.access_token,
        access_token_expires_at: new Date(data.access_token_expires_at),
      },
      user: {
        ...data.account,
      },
    });

    cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = handleCurionaError(error);
    console.log("err", err);

    return NextResponse.json(
      { success: false, message: err.errorMessage },
      { status: err.statusCode }
    );
  }
}
