import type { NextConfig } from "next";

// GitHub Pages デプロイ時のみ静的エクスポート設定を適用
const isGHPages = process.env.GHPAGES === 'true';

const nextConfig: NextConfig = {
  ...(isGHPages && {
    output: "export",
    basePath: "/todo",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
