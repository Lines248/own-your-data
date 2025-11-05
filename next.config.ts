import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "react", "next"],
  },
};

export default nextConfig;