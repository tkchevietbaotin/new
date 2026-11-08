import type { Metadata } from 'next';
import './globals.css';
import { EcoStoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EcoScan AI - Phân loại rác & Mạng xã hội sống xanh',
  description: 'Trí tuệ nhân tạo quét phân loại rác thải, đánh giá khả năng tái chế, tích lũy điểm thưởng và kết nối cộng đồng hành động vì môi trường.',
  keywords: ['EcoScan', 'AI phân loại rác', 'sống xanh', 'zero waste', 'tái chế', 'green points'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
        <EcoStoreProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </EcoStoreProvider>
      </body>
    </html>
  );
}
