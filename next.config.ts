import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

let configWithPwa = nextConfig;

// Turbopack doesn't support withPWA yet, so we only enable it for production builds (which use Webpack).
if (process.env.NODE_ENV === 'production') {
    const withPWA = require('next-pwa')({
        dest: 'public',
        register: true,
        skipWaiting: true,
    });
    configWithPwa = withPWA(nextConfig);
}


export default configWithPwa;
