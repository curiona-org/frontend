"use server";

import { signIn as baseSignIn } from "@/shared/auth";
import { CurionaError } from "@/shared/helpers/error";
import { unstable_rethrow } from "next/navigation";
import { FormTypeSignUp } from "./form";

export async function signUp(
  type: "credentials" | "google",
  data?: Omit<FormTypeSignUp, "confirmPassword">
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
