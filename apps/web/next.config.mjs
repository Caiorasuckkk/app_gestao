/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpila os packages do monorepo (que exportam TS direto, sem build).
  transpilePackages: ["@harmoni/core", "@harmoni/ui", "@harmoni/api-client"],
};

export default nextConfig;
