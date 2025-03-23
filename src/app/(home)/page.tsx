"use client";
import { useAuth } from "@/components/providers/auth-provider";
import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";

export default function Page() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <HomeAuthenticated />;
  }

  return <HomeGuest />;
}
