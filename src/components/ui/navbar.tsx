"use client";
import { useAuth } from "@/providers/auth-provider";
import NavigationBarAuthenticated from "../navbar-authenticated";
import NavigationBarGuest from "../navbar-guest";

const NavigationBar = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <NavigationBarAuthenticated />;
  }

  return <NavigationBarGuest />;
};

export default NavigationBar;
