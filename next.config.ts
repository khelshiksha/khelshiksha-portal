import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Read the script-src line before trusting this too far: it carries
 * 'unsafe-inline', which is a real weakening. Next.js emits inline bootstrap
 * and hydration scripts, and the theme boot script in layout.tsx must run
 * inline before first paint or every navigation flashes the wrong theme. The
 * strict alternative is a per-request nonce, which requires middleware and
 * makes every page dynamic — trading away the static generation that gets LCP
 * under a second on 4G. Not a trade worth making for a site with no
 * user-generated content and no third-party scripts.
 *
 * The other directives are not weakened and are the ones doing real work:
 * frame-ancestors kills clickjacking outright (stricter than the
 * X-Frame-Options below, which is kept for older browsers), base-uri stops
 * <base> tag injection redirecting every relative URL, form-action stops a
 * form being repointed at an attacker's collector, and object-src closes the
 * plugin vector.
 *
 * Revisit the nonce approach if a third-party script (analytics, chat widget)
 * is ever added — at that point 'unsafe-inline' stops being defensible.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  /* Sanity and Cloudinary match the image remotePatterns below; data: is for
     the inline blur placeholders next/image generates. */
  "img-src 'self' data: blob: https://cdn.sanity.io https://res.cloudinary.com https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self'",
  /* The YouTube facade in blocks/media/video-panel mounts an iframe only
     after someone presses play. Without frame-src it falls back to
     default-src 'self' and that iframe is blocked outright — which would have
     surfaced on the day the first film was published, not before. Scoped to
     the no-cookie host, which is the one the component actually uses. */
  "frame-src 'self' https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
