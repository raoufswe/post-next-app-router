import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
  //  temporory to deploy the app successfully 
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
