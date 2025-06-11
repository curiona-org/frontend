"use server";
import config from "@/lib/config";
import {
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { decrypt, encrypt } from "@/lib/helpers/crypto.helper";
import { ProfileService } from "@/lib/services/profile.service";
import { Session } from "@/lib/session";
import { cookies } from "next/headers";

const service = new ProfileService();
export async function updateProfileAction(newName: string) {
  try {
    const result = await service.updateProfile(newName);

    // update session cookie user details
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(config.SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR],
        code: CurionaErrorCodes.INTERNAL_ERROR,
        data: null,
      };
    }

    const session = await decrypt<Session>(
      decodeURIComponent(sessionCookie.value)
    );

    if (!session) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR],
        code: CurionaErrorCodes.INTERNAL_ERROR,
        data: null,
      };
    }

    session.user.name = newName;
    const payload = await encrypt<Session>(session);
    cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message,
        code: result.code,
        data: null,
      };
    }
  } catch (error) {
    const err = handleCurionaError(error);
    return {
      success: false,
      message: err.message,
      code: err.code,
      data: null,
    };
  }
}
