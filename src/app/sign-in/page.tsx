"use client";
import SignInPage from "@/screens/sign-in";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return <SignInPage />;
}
