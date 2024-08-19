/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [{ protocol: "https", hostname: "cloud.appwrite.io"}]
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    }
};

export default nextConfig;
