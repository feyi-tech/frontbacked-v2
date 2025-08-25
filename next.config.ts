import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  distDir: "build",   // 👈 this controls where the build files go
  output: "export", 
};

export default nextConfig;