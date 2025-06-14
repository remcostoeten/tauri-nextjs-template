/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server actions since we're using static export
  experimental: {
    serverActions: false,
  },
};

export default nextConfig;
