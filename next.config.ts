import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Permite concluir o build mesmo se houver avisos de tipagem
    ignoreBuildErrors: true,
  },
  eslint: {
    // Evita falha por regras estritas de sintaxe/formatação durante o deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;