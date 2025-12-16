/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static build settings
  output: "export",
  // Use environment variable for basePath - change NEXT_PUBLIC_BASE_PATH in .env.production if you rename the repo
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
  webpack: (config) => {
    // Handle canvas and other node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
