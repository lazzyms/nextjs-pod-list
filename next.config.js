/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*.amazonaws.com'],
  },
}

module.exports = nextConfig
