"use client";
import { useSession } from "next-auth/react";

type SignedInProps = {
  children: React.ReactNode;
};

/**
 * Component to render children only if the user is signed in.
 */
export const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default SignedIn;
