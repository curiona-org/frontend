"use server";

import { signIn as baseSignIn } from "@/shared/auth";
import { FormTypeSignIn } from "./form";

export async function signIn(
  type: "credentials" | "google",
  data?: FormTypeSignIn
) {
  return baseSignIn(type, {
    ...data,
    redirect: true,
    redirectTo: "/",
  });
}
