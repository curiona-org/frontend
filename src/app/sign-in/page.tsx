"use client";

import { useAuth } from "@/components/providers/auth-provider";
import SignInPage from "@/screens/sign-in";
import { redirect } from "next/navigation";

export default function Page() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    redirect("/");
  }

  return <SignInPage />;
}
