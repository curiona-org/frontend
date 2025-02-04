import { AuthService } from "@/shared/services/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authService = new AuthService();

const authConfig = {
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export default NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          const { data: result } = await authService.loginEmailPassword(
            credentials.email,
            credentials.password
          );

          if (!result.success) {
            return null;
          }

          return {
            id: result["data"]["account"].id,
            email: result["data"]["account"].email,
            name: result["data"]["account"].name,
            image: result["data"]["account"].avatar,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google") {
        try {
          const { data: result } = await authService.loginOAuth(
            account.id_token as string
          );

          return result.success;
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user = user;
        session.token = token;
        session.id_token = token.id_token;
        session.logged_in = user ? true : false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
});
