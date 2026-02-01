// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast"; // 👈 1. Import Toaster เข้ามา

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "iHAVEGPU Store",
  description: "ร้านอุปกรณ์คอมพิวเตอร์ครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans antialiased bg-white text-neutral-900 min-h-screen flex flex-col`}>
        {/* ครอบ Providers ไว้ที่นี่ เพื่อให้ทุกหน้าใช้ Session และ State ได้ */}
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          
          {/* 🔥 2. วาง Toaster ไว้ตรงนี้ เพื่อให้แจ้งเตือนเด้งได้ทุกหน้า */}
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
            }} 
          />
        </Providers>
      </body>
    </html>
  );
}