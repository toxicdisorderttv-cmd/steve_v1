import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "*.supabase.co" },
      { hostname: "uievsodhrpffownrclas.supabase.co" },
    ],
  },
};

export default nextConfig;
