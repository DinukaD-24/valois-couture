import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/valois-couture",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
