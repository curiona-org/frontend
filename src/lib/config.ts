export const config = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  // websocket url replace http:// or https:// with empty
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "",
  SESSION_COOKIE_NAME:
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "curiona-session",
  SESSION_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export default config;
