const config = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  // websocket url replace http:// or https:// with empty
  WEBSOCKET_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL.replace(/^https?:\/\//, "") || "",
  SESSION_COOKIE_NAME:
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "curiona-session",
};

export default config;
