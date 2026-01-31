// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google"; // 👈 1. Import Kanit
import "./globals.css";

// 2. ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"], // เลือกความหนาที่ใช้
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "I HAVE GPU Shop",
  description: "ร้านอุปกรณ์คอมพิวเตอร์ครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans antialiased bg-black text-white`}>
        {/* 👆 3. ใส่ class font-sans และ bg-black */}
        {children}
      </body>
    </html>
  );
}