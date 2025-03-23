"use client";

import { refreshSessionAction, signOutAction } from "@/app/(auth)/actions";
import { signInAction } from "@/app/(auth)/sign-in/actions";
import { signUpAction } from "@/app/(auth)/sign-up/actions";
import { handleCurionaError } from "@/lib/error";
import { Session, shouldRefreshToken } from "@/lib/session";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  authError: string | null;
  authIsLoading: boolean;
  isLoggedIn: boolean;
  signUp: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

type AuthProviderProps = {
  initialSession: Session | null;
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  authError: null,
  authIsLoading: true,
  isLoggedIn: false,
  signUp: async () => {},
  signIn: async () => {},
  signInGoogle: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialSession,
}) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [authError, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialSession ? true : false);

  // Periodically check if token needs refresh (every minute)
  useEffect(() => {
    if (!session) return;

    const checkTokenInterval = setInterval(() => {
      if (session && shouldRefreshToken(session, 5 * 60 * 1000)) {
        refreshSession();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkTokenInterval);
  }, [session]);

  // Register new user
  const signUp = async (params: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);

      const result = await signUpAction(params);

      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      setSession({
        tokens: {
          access_token: result.data.access_token,
          access_token_expires_at: new Date(
            result.data.access_token_expires_at
          ),
        },
        user: {
          ...result.data.account,
        },
      });

      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      const err = handleCurionaError(error);
      setError(err.message || "Failed to sign up");
      setIsLoading(false);
    }
  };

  // Login with email/password
  const signIn = async (params: { email: string; password: string }) => {
    try {
      setIsLoading(true);

      const result = await signInAction(params);

      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      setSession({
        tokens: {
          access_token: result.data.access_token,
          access_token_expires_at: new Date(
            result.data.access_token_expires_at
          ),
        },
        user: {
          ...result.data.account,
        },
      });

      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      const err = handleCurionaError(error);
      setError(err.message || "Failed to sign in");
      setIsLoading(false);
    }
  };

  // Login with OAuth token
  const signInGoogle = () => {
    redirect("/api/auth/sign-in/google");
  };

  // Logout
  const signOut = async () => {
    setIsLoading(true);
    await signOutAction();
    setSession(null);
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const result = await refreshSessionAction();
      if (!result.success || !result.newSession) {
        setError(result.message || "Failed to refresh session");
        setIsLoading(false);
        return;
      }
      setSession(result.newSession);
      setIsLoading(false);
    } catch (error) {
      const err = handleCurionaError(error);
      setError(err.message || "Failed to refresh session");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        authError,
        authIsLoading: isLoading,
        isLoggedIn,
        signUp,
        signIn,
        signInGoogle,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
