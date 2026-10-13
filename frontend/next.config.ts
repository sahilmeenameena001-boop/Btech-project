import type { NextConfig } from "next";

// Where the Flask backend (IndicXlit-master/app/start_server.py) is running.
const XLIT_API_URL = process.env.XLIT_API_URL ?? "http://localhost:8888";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [{ source: "/xlit/:path*", destination: `${XLIT_API_URL}/:path*` }];
  },
};

export default nextConfig;
