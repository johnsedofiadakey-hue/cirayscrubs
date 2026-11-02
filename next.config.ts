import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: { root: process.cwd() },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
