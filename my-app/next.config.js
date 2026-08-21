const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    minimumCacheTTL: 2678400,
  },
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
