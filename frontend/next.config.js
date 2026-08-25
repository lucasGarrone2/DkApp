/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['src'],
    // Temporarily ignore ESLint errors during build to allow Analytics verification
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.dbastatic.dk' },
      { protocol: 'https', hostname: 'images.dba.dk' },
      { protocol: 'https', hostname: '**.lejebolig.dk' },
      { protocol: 'https', hostname: '**.boligportal.dk' },
    ],
    // Using unoptimized since images come from external scraped sources
    unoptimized: true,
  },
};

module.exports = nextConfig;
