// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; // 👈 1. Import Providers

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
        {/* 2. ครอบ Providers ไว้ที่นี่ เพื่อให้ทุกหน้า (รวมถึง Cart) ใช้ useSession ได้ */}
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}