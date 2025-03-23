"use client";

import { useAuth } from "@/components/providers/auth-provider";

type GuestProps = {
  children: React.ReactNode;
};

/**
 * Component to render children only if the user is not signed in.
 */
const Guest: React.FC<GuestProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default Guest;
