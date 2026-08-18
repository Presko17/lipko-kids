/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger product photo uploads through server actions.
  experimental: {
    serverActions: {
      // Allows product photo/video uploads. For large videos, prefer a
      // YouTube/Vimeo link instead of uploading the file.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
