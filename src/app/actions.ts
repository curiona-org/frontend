"use server";

import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { decrypt } from "@/lib/helpers/crypto.helper";
import { Session } from "@/lib/session";
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(config.SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return {
        ok: false,
        session: null,
      };
    }

    const session = await decrypt<Session>(
      decodeURIComponent(sessionCookie.value)
    );

    return { ok: true, session };
  } catch (error) {
    throw handleCurionaError(error);
  }
}
