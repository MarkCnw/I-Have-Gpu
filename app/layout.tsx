// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"; // 👈 1. Import Footer มา

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
      {/* 2. ปรับ Body:
            - เปลี่ยน bg-black -> bg-white (ให้ตรงกับธีม Clean)
            - เปลี่ยน text-white -> text-neutral-900 (ตัวหนังสือสีเข้มบนพื้นขาว)
            - เพิ่ม min-h-screen และ flex-col เพื่อดัน Footer ลงล่างสุดเสมอ
      */}
      <body className={`${kanit.variable} font-sans antialiased bg-white text-neutral-900 min-h-screen flex flex-col`}>
        <div className="flex-1">
          {children}
        </div>
        
        {/* 3. ใส่ Footer ไว้ด้านล่างสุด */}
        <Footer />
      </body>
    </html>
  );
}