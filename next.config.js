/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['html-to-image'],
  },
  images: {
    domains: ['i.ibb.co'],
  },
}

module.exports = nextConfig
