/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  allowedImageDomains: ["localhost", "fhkrmjttxmwutdcwyuhm.supabase.co"],
}

export default nextConfig
