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
      {
        protocol: 'https',
        hostname: 'static.gigabyte.com',
        port: '',
        pathname: '/**',
      },
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
      // 🔥 เพิ่ม Amazon
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      // 🔥 เพิ่มแบรนด์อื่นๆ ที่นิยมใช้
      {
        protocol: 'https',
        hostname: 'www.jib.co.th', // JIB
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.advice.co.th', // Advice
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bananait.co.th', // Banana IT
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com', // Imgur
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.bnn.in.th', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.advice.co.th', // Advice
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jib.co.th', // JIB
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // เผื่อไว้สำหรับรูปประกอบข่าว
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;