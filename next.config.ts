import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // Common for static exports or specific hosting environments
  }
};

export default nextConfig;
