import type { NextConfig } from "next";
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org', 'srvdigital.fun'],
  },
  output: 'standalone',
  distDir: '.next',
  experimental: {
    optimizePackageImports: ['@supabase/auth-helpers-nextjs'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack: (config: Configuration) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/video/:path*',
        destination: 'http://srvdigital.fun/movie/:path*',
      },
    ];
  },
};

export default nextConfig;
