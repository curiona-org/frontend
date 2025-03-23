"use client";

import { CurionaError, handleCurionaError } from "@/lib/error";
import { apiClient } from "@/lib/services/api.service";
import { Session, shouldRefreshToken } from "@/lib/session";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  authError: CurionaError | null;
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
  const [error, setError] = useState<CurionaError | null>(null);
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
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/api/auth/sign-up", params);

      setSession({
        tokens: {
          access_token: data.access_token,
          access_token_expires_at: data.access_token_expires_at,
        },
        user: {
          ...data.account,
        },
      });

      setIsLoggedIn(true);
    } catch (error) {
      const err = handleCurionaError(error);

      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email/password
  const signIn = async (params: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/api/auth/sign-in", params);

      setSession({
        tokens: {
          access_token: data.access_token,
          access_token_expires_at: data.access_token_expires_at,
        },
        user: {
          ...data.account,
        },
      });

      setIsLoggedIn(true);
    } catch (error) {
      const err = handleCurionaError(error);

      setError(err);
      throw err;
    } finally {
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

    try {
      await apiClient.get("/api/auth/sign-out");

      setSession(null);
      setIsLoggedIn(false);
    } catch (error) {
      const err = handleCurionaError(error);

      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.get("/api/auth/refresh");

      if (data.success) {
        setSession(data.session);
        setIsLoggedIn(true);
      }
    } catch (error) {
      const err = handleCurionaError(error);

      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        authError: error,
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
