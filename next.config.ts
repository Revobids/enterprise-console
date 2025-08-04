import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
