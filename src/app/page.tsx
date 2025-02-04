"use client";
import HomeAuthenticated from "@/src/screens/home/authenticated";
import HomeGuest from "@/src/screens/home/guest";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return session ? <HomeAuthenticated /> : <HomeGuest />;
}
