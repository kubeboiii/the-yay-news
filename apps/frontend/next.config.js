import path from "node:path";
import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for Docker deploys; tracing starts at the monorepo root
  // so workspace packages are included.
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  transpilePackages: ["@repo/ui", "@repo/shared"],
  // The emergency admin (/admin) talks to the backend through this same-origin path, so its
  // HTTP-only session cookie stays first-party.
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:4000";
    return [{ source: "/api/v1/admin/:path*", destination: `${backend}/api/v1/admin/:path*` }];
  },
  images: {
    // Design mockups load their photos straight from Unsplash's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
