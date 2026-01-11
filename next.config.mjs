/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // En Next.js 14, cette option doit être dans 'experimental'
    serverComponentsExternalPackages: ['pdf-lib', '@xenova/transformers', 'chromadb', 'onnxruntime-node'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
};

export default nextConfig;
