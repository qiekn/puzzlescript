/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static build settings
  output: "export",
  basePath: "/puzzlescript",
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
