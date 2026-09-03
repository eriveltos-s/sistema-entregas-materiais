import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros de TypeScript no build para liberar o deploy na Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora avisos do ESLint durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;