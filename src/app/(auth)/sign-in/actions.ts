"use server";
import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { AuthOutput } from "@/types/api-auth";
import { cookies } from "next/headers";

const authService = new AuthService();

export type SignInActionInput = {
  email: string;
  password: string;
};

export async function signInAction({
  email,
  password,
}: SignInActionInput): Promise<APIResponse<AuthOutput>> {
  try {
    const result = await authService.loginEmailPassword({ email, password });

    const cookieStore = await cookies();

    const session = await encrypt({
      tokens: {
        access_token: result.data.access_token,
        access_token_expires_at: new Date(result.data.access_token_expires_at),
      },
      user: {
        ...result.data.account,
      },
    });

    cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
