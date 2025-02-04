import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: JWT;
    id_token?: string;
    logged_in?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_token?: string;
  }
}
