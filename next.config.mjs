// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig



/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Fix for ethers/wagmi
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },

  // 👇 This line forces Next.js to use Webpack instead of Turbopack
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
