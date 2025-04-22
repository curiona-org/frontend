"use client";
import { useAuth } from "@/providers/auth-provider";
import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";

export default function HomePage() {
  const { session } = useAuth();

  if (session) {
    return <HomeAuthenticated />;
  }

  return <HomeGuest />;
}
