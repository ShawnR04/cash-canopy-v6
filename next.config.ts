import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts", // Location of your service worker file
  swDest: "public/sw.js", // Output destination in public folder
  disable: process.env.NODE_ENV === "development", // Disable SW in dev mode to avoid caching localhost
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withSerwist(nextConfig);