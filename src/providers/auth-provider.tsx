"use client";

import { refreshSessionAction, signOutAction } from "@/app/(auth)/actions";
import { signInAction, signInGoogleAction } from "@/app/(auth)/sign-in/actions";
import { signUpAction } from "@/app/(auth)/sign-up/actions";
import { updateProfileAction } from "@/app/profile/actions";
import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { APIResponse } from "@/lib/services/api.service";
import { Session, shouldRefreshToken } from "@/lib/session";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  authError: string | null;
  authIsLoading: boolean;
  isLoggedIn: boolean;
  updateProfile: (name: string) => Promise<void>;
  signUp: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  signIn: (params: { email: string; password: string }) => Promise<boolean>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearAuthError: () => void;
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
  updateProfile: async () => {},
  signUp: async () => false,
  signIn: async () => false,
  signInGoogle: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
  clearAuthError: () => {},
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
      if (session && shouldRefreshToken(session, config.SESSION_EXPIRY_MS)) {
        refreshSession();
      }
    }, 60 * 1000); // Check every minutes

    return () => clearInterval(checkTokenInterval);
  }, [session]);

  const updateProfile = async (name: string) => {
    if (!session) return;

    try {
      setIsLoading(true);

      const result = await updateProfileAction(name);
      if (!result.success || !result.data) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      setSession({
        ...session,
        user: {
          ...session.user,
          name,
        },
      });
    } catch (error) {
      const err = handleCurionaError(error);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const signUp = async (params: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);

      const result = await signUpAction(params);

      if (!result.success || !result.data) {
        setError(result.message);
        setIsLoading(false);
        return false;
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
      setIsLoading(false);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      const err = error as APIResponse;
      setError(err.message || "Failed to sign up");
      setIsLoading(false);
      return false;
    }
  };

  // Login with email/password
  const signIn = async (params: { email: string; password: string }) => {
    try {
      setIsLoading(true);

      const result = await signInAction(params);

      if (!result.success || !result.data) {
        setError(result.message);
        setIsLoading(false);
        return false;
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
      setIsLoading(false);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      const err = error as APIResponse;
      setError(err.message || "Failed to sign in");
      setIsLoading(false);
      return false;
    }
  };

  // Login with OAuth token
  const signInGoogle = async () => {
    await signInGoogleAction();
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

  // Clear auth error
  const clearAuthError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        authError,
        authIsLoading: isLoading,
        isLoggedIn,
        updateProfile,
        signUp,
        signIn,
        signInGoogle,
        signOut,
        refreshSession,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
