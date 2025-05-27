"use server";
import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { AuthOutput } from "@/types/api-auth";
import { cookies } from "next/headers";

const authService = new AuthService();

export type SignUpActionInput = {
  name: string;
  email: string;
  password: string;
};

export async function signUpAction({
  name,
  email,
  password,
}: SignUpActionInput): Promise<APIResponse<AuthOutput>> {
  try {
    const result = await authService.register({ name, email, password });

    if (!result.success) {
      return result;
    }

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

    cookieStore.set("refresh_token", result.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: result.data.refresh_token_expires_in,
      expires: new Date(result.data.refresh_token_expires_at),
    });

    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
