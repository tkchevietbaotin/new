'use client';

import React from 'react';
import Link from 'next/link';
import { useEcoStore } from '@/lib/store';
import {
  Scan,
  Users,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Bot,
  MapPin,
  AlertTriangle,
  Globe2,
  CheckCircle2,
  Wind,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react';
import PostCard from '@/components/PostCard';

export default function HomePage() {
  const { user, scans, posts, alerts, locations } = useEcoStore();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 bg-gradient-to-br from-emerald-900 via-forest-900 to-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>Nền tảng Sinh Thái Thông Minh Toàn Diện 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Hệ Sinh Thái <span className="text-emerald-400">EcoScan AI</span>,<br />
            Hành Động Vì <span className="text-teal-300">Hành Tinh Xanh</span>.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Tích hợp toàn diện: <strong>Nhận diện rác bằng AI Vision</strong>, trợ lý tư vấn sinh thái <strong>EcoBot AI</strong>, <strong>Bản đồ số</strong> điểm thu gom pin & phế liệu, hệ thống <strong>Cảnh báo ô nhiễm AQI</strong> và <strong>Cộng đồng sống xanh 0 đồng</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/scan"
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Scan className="w-5 h-5 text-slate-950" />
              <span>Bắt đầu Quét AI Ngay</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/chatbot"
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Bot className="w-5 h-5 text-emerald-300" />
              <span>Hỏi Trợ Lý EcoBot</span>
            </Link>

            <Link
              href="/map"
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Bản Đồ Điểm Thu Gom</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>AI Vision 98%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>EcoBot 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Bản đồ 63 tỉnh thành</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Cảnh báo AQI liên tục</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Live Counter */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-100 space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Scan className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 pt-2">
            {scans.length + 1542}
          </p>
          <p className="text-xs font-semibold text-slate-500">Lượt quét phân loại thành công</p>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-100 space-y-1">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 pt-2">
            386.4 <span className="text-sm font-bold text-slate-500">kg</span>
          </p>
          <p className="text-xs font-semibold text-slate-500">Khí CO₂ ngăn ngừa phát thải</p>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-100 space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 pt-2">
            18,450 <span className="text-sm font-bold text-slate-500">GP</span>
          </p>
          <p className="text-xs font-semibold text-slate-500">Green Points tích lũy toàn mạng</p>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-100 space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 pt-2">
            1,280+
          </p>
          <p className="text-xs font-semibold text-slate-500">Thành viên sống xanh tích cực</p>
        </div>
      </section>

      {/* Feature Pillars: 5 Core Capabilities */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            5 Trụ Cột Đột Phá
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Giải pháp thông minh vì môi trường bền vững
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Kết hợp công nghệ trí tuệ nhân tạo, dữ liệu địa lý số và sức mạnh kết nối cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Image Recognition */}
          <Link
            href="/scan"
            className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              1. Nhận Diện Hình Ảnh & Quét AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mô hình thị giác máy tính nhận diện chai nhựa, bao bì, rác nguy hại, vẽ khung bounding box trực quan và chấm điểm Eco Score.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              Trải nghiệm studio quét <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 2: Chatbot */}
          <Link
            href="/chatbot"
            className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              2. Trợ Lý Cố Vấn EcoBot AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tư vấn trực tiếp 24/7 về phân loại các loại nhựa #1-#7, bí quyết ủ phân hữu cơ bokashi, ý tưởng DIY và thói quen zero-waste.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
              Trò chuyện ngay <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 3: Eco Map */}
          <Link
            href="/map"
            className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              3. Bản Đồ Số Thu Gom & Refill
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bản đồ tương tác chỉ dẫn các điểm bỏ pin cũ an toàn, vựa thu mua phế liệu, trạm làm đầy dầu gội (refill) và thùng rác phân loại.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              Mở bản đồ <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 4: Alerts */}
          <Link
            href="/alerts"
            className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
              4. Cảnh Báo Ô Nhiễm & Chỉ Số AQI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Theo dõi chất lượng không khí PM2.5, chỉ số UV và hệ thống báo cáo điểm nóng xả rác tự phát để kêu gọi tình nguyện viên làm sạch.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
              Xem bảng cảnh báo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 5: Community & Marketplace */}
          <Link
            href="/community"
            className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group space-y-4 md:col-span-2 lg:col-span-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              5. Mạng Xã Hội Xanh & Chợ Trao Đổi Đồ Cũ 0 Đồng
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Eco Feed chia sẻ mẹo tái chế, Chợ Xanh cho/tặng chai lọ và quần áo cũ, cùng các sự kiện đổi pin lấy sen đá và workshop môi trường thú vị.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              Tham gia cộng đồng <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Community Feed Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Cộng đồng chia sẻ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Bài viết nổi bật trên Eco Feed
            </h2>
          </div>
          <Link
            href="/community"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
