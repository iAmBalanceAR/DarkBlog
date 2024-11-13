/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@/app/components/admin/keywords': false,
      },
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  pageExtensions: ['ts', 'tsx'],
}

module.exports = nextConfig