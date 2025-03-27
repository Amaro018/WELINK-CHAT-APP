import type { NextConfig } from "next";

console.log(
  "NEXT_PUBLIC_API_PATH in next.config.ts:",
  process.env.NEXT_PUBLIC_API_PATH
);
const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,

  env: {
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH,
  },

  images: {
    domains: ["res.cloudinary.com"], // Allow images from Cloudinary
  },
};

export default nextConfig;
