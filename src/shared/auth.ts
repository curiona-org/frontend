import { AuthService } from "@/shared/services/auth.service";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { handleCurionaError } from "./helpers/error.helper";

const authService = new AuthService();

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        name: {},
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          let result;
          if (credentials.name !== "") {
            result = await authService.register(
              credentials.name as string,
              credentials.email as string,
              credentials.password as string
            );
          } else {
            result = await authService.loginEmailPassword(
              credentials.email as string,
              credentials.password as string
            );
          }

          if (!result.success) {
            console.error(result.message);
            return null;
          }

          if (!result.data) {
            console.error("No data returned");
            return null;
          }

          return {
            id: String(result.data.account.id),
            method: result.data.account.method,
            email: result.data.account.email,
            name: result.data.account.name,
            avatar: result.data.account.avatar,
            joined_at: new Date(result.data.account.joined_at),
            tokens: {
              access_token: result.data.access_token,
              access_token_expires_at: result.data.access_token_expires_at,
            },
          };
        } catch (error) {
          throw handleCurionaError(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        try {
          const result = await authService.loginOAuth(
            account.id_token as string
          );

          if (!result.success) {
            console.error(result.message);
            return false;
          }

          if (!result.data) {
            console.error("No data returned");
            return false;
          }

          user.id = String(result.data.account.id);
          user.method = result.data.account.method;
          user.email = result.data.account.email;
          user.name = result.data.account.name;
          user.avatar = result.data.account.avatar;
          user.joined_at = new Date(result.data.account.joined_at);
          user.tokens = {
            access_token: result.data.access_token,
            access_token_expires_at: result.data.access_token_expires_at,
          };

          return result.success;
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar;
        token.joined_at = user.joined_at;
        token.method = user.method;
        token.tokens = user.tokens;
      }

      console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      console.log({ token, user });

      const now = new Date();
      const accessExpiresAt = new Date(token.tokens.access_token_expires_at);
      if (accessExpiresAt < now) {
        try {
          const result = await authService.refresh();

          if (!result.success) {
            console.error(result.message);
            return token;
          }

          if (!result.data) {
            console.error("No data returned");
            return token;
          }

          token.tokens.access_token = result.data.access_token;
          token.tokens.access_token_expires_at =
            result.data.access_token_expires_at;
        } catch (error) {
          console.error("Failed to refresh token", error);
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        data: token,
        isLoggedIn: !!token,
      };
    },
  },

  pages: {
    signIn: "/sign-in",
  },
});
