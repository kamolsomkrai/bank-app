import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   serverComponentsExternalPackages: ["@next/swc"],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // เพิ่มบรรทัดนี้หากมีปัญหา TypeScript
  },
};

export default nextConfig;
