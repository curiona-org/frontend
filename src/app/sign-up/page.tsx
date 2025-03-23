"use client";

import { useAuth } from "@/providers/auth-provider";
import SignUpPage from "@/screens/sign-up";
import { redirect } from "next/navigation";

export default function Page() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    redirect("/");
  }

  return <SignUpPage />;
}
