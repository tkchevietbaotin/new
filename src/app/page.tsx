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
  Recycle,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import PostCard from '@/components/PostCard';

export default function HomePage() {
  const { user, scans, posts } = useEcoStore();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 bg-gradient-to-br from-emerald-900 via-forest-900 to-slate-900 text-white shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>Nền tảng Phân Loại Rác Thông Minh Bằng AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Quét Rác Bằng <span className="text-emerald-400">AI</span>,<br />
            Chung Tay Sống <span className="text-teal-300">Xanh Bền Vững</span>.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Chỉ với một bức ảnh, <strong>EcoScan AI</strong> nhận diện vật liệu trong tích tắc, chấm điểm <strong>Eco Score</strong>, hướng dẫn xử lý đúng quy chuẩn và quy đổi thành <strong>Green Points</strong> để cùng cộng đồng kiến tạo lối sống không rác thải.
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
              href="/community"
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Users className="w-5 h-5 text-emerald-300" />
              <span>Ghé Thăm Cộng Đồng</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Độ chính xác AI 98%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Chuẩn phân loại 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tích điểm đổi quà xanh</span>
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

      {/* How It Works: 3 Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Quy trình thông minh
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Chỉ 3 bước đơn giản để tái chế chuẩn xác
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Ứng dụng công nghệ thị giác máy tính tiên tiến giúp việc phân loại rác thải tại nguồn trở nên dễ dàng và thú vị hơn bao giờ hết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-800">Chụp hoặc Tải ảnh vật phẩm</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dùng camera điện thoại chụp chai nhựa, lon nhôm, hộp giấy, pin cũ hoặc kéo thả ảnh trực tiếp từ thư viện máy.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI Phân Tích & Chấm Eco Score</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mô hình thị giác máy tính nhận diện thành phần chất liệu, đo lường thời gian phân hủy, tính lượng CO2 tiết kiệm và đề xuất ý tưởng DIY.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tích Điểm & Lan Tỏa Cộng Đồng</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi món đồ phân loại thành công được thưởng Green Points, mở khóa huy hiệu sinh thái độc quyền và chia sẻ lên Eco Feed.
            </p>
          </div>
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

      {/* Daily Eco Tip Box */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900">Mẹo Xanh Hôm Nay (Daily Eco Tip)</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              1 tấn giấy tái chế giúp cứu sống 17 cây xanh trưởng thành và tiết kiệm 26.000 lít nước sạch! Hãy gom sạch giấy vụn và bìa carton vào tuần này nhé.
            </p>
          </div>
        </div>
        <Link
          href="/scan"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 shadow-sm flex-shrink-0 transition-all"
        >
          Quét rác giấy ngay
        </Link>
      </section>
    </div>
  );
}
