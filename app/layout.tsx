// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import CustomerChat from "@/components/CustomerChat"; // ✅ 1. Chat
import CompareFloatingBar from "@/components/CompareFloatingBar"; // ✅ 2. Compare Bar

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
      <body className={`${kanit.variable} font-sans antialiased bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          
          {/* ✅ ส่วนเสริม: แชทและแถบเปรียบเทียบ */}
          <CustomerChat />
          <CompareFloatingBar />
          
          {/* Toaster แจ้งเตือน */}
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