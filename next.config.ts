import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure jspdf is only bundled on client-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('jspdf');
    }
    return config;
  },
};

export default nextConfig;
