import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 静态导出配置（如需 SSG）
  // output: 'export',

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // 静态导出时需要禁用图片优化 API
    // unoptimized: true,
  },

  // 实验性功能
  experimental: {
    // 启用优化包导入
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};

export default nextConfig;
