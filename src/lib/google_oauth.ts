import { Google } from "arctic";

export const google = new Google(
  process.env.AUTH_GOOGLE_ID ?? "",
  process.env.AUTH_GOOGLE_SECRET ?? "",
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth/sign-in/google/callback"
    : "https://curiona.netlify.app/api/auth/sign-in/google/callback"
);
