import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/polyfills.js",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
