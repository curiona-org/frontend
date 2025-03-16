"use server";

import { signIn as baseSignIn } from "@/shared/auth";
import { FormTypeSignUp } from "./form";

export async function signUp(
  type: "credentials" | "google",
  data?: Omit<FormTypeSignUp, "confirmPassword">
) {
  return baseSignIn(type, {
    ...data,
    redirect: true,
    redirectTo: "/",
  });
}
