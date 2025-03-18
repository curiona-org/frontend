import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hostedboringavatars.vercel.app",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
