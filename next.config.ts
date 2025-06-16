import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  distDir: "dist",
  devIndicators: false,
};

export default nextConfig;
