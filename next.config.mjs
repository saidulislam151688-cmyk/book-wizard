/** @type {import('next').NextConfig} */
const nextConfig = {
    // Already using Turbopack in dev (via next dev --turbo)

    // Production optimizations
    // swcMinify is true by default in Next.js 15+


    // Reduce bundle size
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Enable React strict mode for better performance checks
    reactStrictMode: true,

    // Optimize images
    images: {
      formats: ['image/webp', 'image/avif'],
    },
};

export default nextConfig;
