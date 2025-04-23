import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Only run ESLint during development, disable in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
