import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // ✅ เพิ่มส่วนนี้เพื่อแก้ Error ครับ
      {
        protocol: 'https',
        hostname: 'static.gigabyte.com',
        port: '',
        pathname: '/**',
      },
      // 👇 ผมแถมโดเมนแบรนด์คอมฯ อื่นๆ ให้ด้วย เผื่อคุณก๊อปรูปมาใช้จะได้ไม่ Error อีก
      {
        protocol: 'https',
        hostname: 'dlcdnwebimgs.asus.com', // ASUS
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.msi.com', // MSI
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.corsair.com', // Corsair
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;