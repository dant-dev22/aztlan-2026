/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/registro/infantil',
        destination: '/registro/juvenil',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

