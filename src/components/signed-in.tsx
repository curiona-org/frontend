"use client";

import { useAuth } from "@/components/providers/auth-provider";

type SignedInProps = {
  children: React.ReactNode;
};

/**
 * Component to render children only if the user is signed in.
 */
const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default SignedIn;
