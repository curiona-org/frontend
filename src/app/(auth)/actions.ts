"use server";
import { auth } from "@/lib/auth";
import config from "@/lib/config";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { Session } from "@/lib/session";
import { AuthRefreshOutput } from "@/types/api-auth";
import { cookies } from "next/headers";

const authService = new AuthService();

export async function signOutAction() {
  const session = await auth();

  if (!session) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.delete(config.SESSION_COOKIE_NAME);
}

export async function refreshSessionAction(): Promise<
  Partial<APIResponse<AuthRefreshOutput>> & { newSession?: Session }
> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const cookieStore = await cookies();
  const result = await authService.refresh();

  if (!result.success) {
    cookieStore.delete(config.SESSION_COOKIE_NAME);
    return result;
  }

  const newSession: Session = {
    ...session,
    tokens: {
      access_token: result.data.access_token,
      access_token_expires_at: new Date(result.data.access_token_expires_at),
    },
  };

  const payload = await encrypt<Session>(newSession);

  cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return {
    ...result,
    newSession,
  };
}
