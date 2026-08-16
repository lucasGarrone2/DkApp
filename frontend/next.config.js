/** @type {import('next').NextConfig} */
const nextConfig = {
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
