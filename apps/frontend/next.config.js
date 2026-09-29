import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for Docker deploys; tracing starts at the monorepo root
  // so workspace packages are included.
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  transpilePackages: ["@repo/ui", "@repo/shared"],
};

export default nextConfig;
