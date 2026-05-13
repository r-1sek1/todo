import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages のリポジトリ名に合わせたbasePath
  basePath: process.env.GHPAGES ? "/todo" : "",
  images: { unoptimized: true },
};

export default nextConfig;
