import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'umeda.oh-oku.jp' },
      { protocol: 'https', hostname: 'umeda.pururun-komachi.com' },
      { protocol: 'https', hostname: 'umeda.spark-spark.com' },
    ],
  },
};

export default nextConfig;
