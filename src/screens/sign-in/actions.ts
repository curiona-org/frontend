"use server";

import { signIn as baseSignIn } from "@/shared/auth";
import { CurionaError } from "@/shared/helpers/error.helper";
import { unstable_rethrow } from "next/navigation";
import { FormTypeSignIn } from "./form";

export async function signIn(
  type: "credentials" | "google",
  data?: FormTypeSignIn
) {
  try {
    const r = await baseSignIn(type, {
      ...data,
      redirect: true,
      redirectTo: "/",
    });

    return r;
  } catch (error: unknown) {
    const err = error as { cause?: { err?: unknown } };
    if (err.cause?.err instanceof CurionaError) {
      return {
        code: err.cause.err.code,
        error: err.cause.err.errorMessage,
      };
    }
    unstable_rethrow(error);
    throw error;
  }
}
