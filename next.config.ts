import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: {
    // Photos uploaded from the admin live in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // Admin photo uploads. The browser shrinks photos before sending, so
      // this is headroom; Vercel caps a function request at 4.5 MB anyway.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
