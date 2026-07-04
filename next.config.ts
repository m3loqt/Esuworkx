import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1mb is too small for phone-camera payment-proof screenshots.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
