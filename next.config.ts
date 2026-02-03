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
      // เผื่อไว้สำหรับรูปที่อัปโหลดเองในโปรเจกต์ (ถ้ามี)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // เผื่อกรณีใช้ Google Auth แล้วดึงรูปโปรไฟล์
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Config อื่นๆ (ถ้ามี)
};

export default nextConfig;