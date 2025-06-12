"use server";

import config from "@/lib/config";
import {
  CurionaError,
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { decrypt } from "@/lib/helpers/crypto.helper";
import { Session } from "@/lib/session";
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(config.SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      throw new CurionaError(
        CurionaErrorCodes.INTERNAL_ERROR,
        ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR]
      );
    }

    const session = await decrypt<Session>(
      decodeURIComponent(sessionCookie.value)
    );

    return session;
  } catch (error) {
    throw handleCurionaError(error);
  }
}
