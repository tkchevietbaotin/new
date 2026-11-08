import type { Metadata } from 'next';
import './globals.css';
import { EcoStoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EcoBotWidget from '@/components/EcoBotWidget';

export const metadata: Metadata = {
  title: 'EcoScan AI - Phân loại rác, Bản đồ số, Chatbot & Cảnh báo môi trường',
  description: 'Trí tuệ nhân tạo quét phân loại rác thải, tư vấn sinh thái với EcoBot AI, tra cứu bản đồ điểm thu gom và theo dõi cảnh báo môi trường AQI.',
  keywords: ['EcoScan', 'AI phân loại rác', 'EcoBot', 'bản đồ số tái chế', 'cảnh báo môi trường AQI', 'sống xanh', 'zero waste'],
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
          <EcoBotWidget />
        </EcoStoreProvider>
      </body>
    </html>
  );
}
