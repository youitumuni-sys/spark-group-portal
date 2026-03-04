import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.oh-oku.jp' },
      { protocol: 'https', hostname: '**.pururun-komachi.com' },
      { protocol: 'https', hostname: '**.spark-spark.com' },
      { protocol: 'https', hostname: '**.cityheaven.net' },
    ],
  },
  basePath: '/spark-group-portal',
};

export default nextConfig;
