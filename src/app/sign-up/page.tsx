"use client";

import SignUpPage from "@/src/screens/sign-up";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return <SignUpPage />;
}
