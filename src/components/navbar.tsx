"use server";
import { auth } from "@/lib/auth";
import NavigationBarAuthenticated from "./navbar-authenticated";
import NavigationBarGuest from "./navbar-guest";

const NavigationBar = async () => {
  const session = await auth();

  if (session) {
    return <NavigationBarAuthenticated />;
  }

  return <NavigationBarGuest />;
};

export default NavigationBar;
