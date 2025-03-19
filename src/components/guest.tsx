"use client";
import { useSession } from "next-auth/react";

type GuestProps = {
  children: React.ReactNode;
};

/**
 * Component to render children only if the user is not signed in.
 */
export const Guest: React.FC<GuestProps> = ({ children }) => {
  const session = useSession();

  if (session) {
    return null;
  }

  return <>{children}</>;
};

export default Guest;
