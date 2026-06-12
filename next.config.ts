import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/boutique/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;