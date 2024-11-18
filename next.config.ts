import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    API_URL:process.env.BACKEND_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/myaiwiz-storage.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;
