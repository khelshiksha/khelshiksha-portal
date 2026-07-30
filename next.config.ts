import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    /* Sanity and Cloudinary are the planned asset hosts; local /public assets
       need no entry here. */
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /* Without this, importing three Lucide icons can pull the barrel file. */
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },

  async redirects() {
    return [
      { source: "/for-schools", destination: "/schools", permanent: true },
      { source: "/for-teachers", destination: "/teachers", permanent: true },
      { source: "/for-parents", destination: "/parents", permanent: true },
      { source: "/pillars", destination: "/approach/pillars", permanent: true },
      { source: "/kits", destination: "/products", permanent: true },
      { source: "/games", destination: "/products", permanent: true },
    ];
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
