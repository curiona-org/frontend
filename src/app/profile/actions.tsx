"use server";
import { getSession } from "@/app/actions";
import config from "@/lib/config";
import {
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { ProfileService } from "@/lib/services/profile.service";
import { Session } from "@/lib/session";
import { cookies } from "next/headers";

export async function getProfile() {
  try {
    const { ok, session } = await getSession();

    if (!ok || !session) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const service = new ProfileService(session.tokens.access_token);
    const result = await service.profile();
    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.message,
        code: result.code,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
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

export async function updateProfileAction(newName: string) {
  try {
    const { ok, session } = await getSession();

    if (!ok || !session) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const service = new ProfileService(session.tokens.access_token);
    const result = await service.updateProfile(newName);

    session.user.name = newName;
    const payload = await encrypt<Session>(session);

    // Set the updated session cookie
    const cookieStore = await cookies();
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
