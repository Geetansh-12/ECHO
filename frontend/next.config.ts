import type { NextConfig } from "next";

const isRender = process.env.RENDER === "true";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isRender ? "https://echo-backend-j847.onrender.com" : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
