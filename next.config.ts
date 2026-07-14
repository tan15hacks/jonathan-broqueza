import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/work", destination: "/" },
      { source: "/services", destination: "/" },
      { source: "/about", destination: "/" },
      { source: "/contact", destination: "/" },
    ];
  },
};

export default nextConfig;
