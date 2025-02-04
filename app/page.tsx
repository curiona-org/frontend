"use client";
import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return session ? <HomeAuthenticated /> : <HomeGuest />;
}
