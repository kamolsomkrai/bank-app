import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["@next/swc"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
