/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracing: false,
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

export default nextConfig;

