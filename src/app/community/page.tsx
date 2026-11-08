'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';
import {
  Users,
  Plus,
  Sparkles,
  Trophy,
  Award,
  Filter,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const { posts, user, users } = useEcoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string>('all');

  const filterTags = [
    { id: 'all', label: 'Tất cả bài viết' },
    { id: '#ZeroWaste', label: '#ZeroWaste' },
    { id: '#TaiCheSangTao', label: '#TaiCheSangTao' },
    { id: '#DIYUpcycling', label: '#DIYUpcycling' },
    { id: '#SongXanh', label: '#SongXanh' },
  ];

  const filteredPosts =
    activeTag === 'all'
      ? posts
      : posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));

  // Top contributors for mini sidebar
  const topUsers = [...users].sort((a, b) => b.greenPoints - a.greenPoints).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Mạng Lưới Sống Xanh Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Eco Feed & Cộng Đồng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nơi chia sẻ mẹo tái chế, trao đổi đồ dùng và cùng nhau thực hành lối sống bền vững.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng bài viết mới (+30 GP)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Post Prompt Box */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="glass-card rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-3.5"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="flex-1 bg-slate-100/80 hover:bg-slate-100 text-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-2xl">
              Bạn có mẹo tái chế hay vật phẩm muốn chia sẻ không?
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng</span>
            </button>
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
              <Filter className="w-3.5 h-3.5" /> Lọc:
            </span>
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTag === tag.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card border border-slate-200 text-slate-400 space-y-3">
                <Compass className="w-10 h-10 mx-auto text-emerald-500 animate-spin" />
                <p className="text-sm font-semibold">Chưa có bài viết nào trong chủ đề này.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Hãy là người đầu tiên đăng bài!
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Mini Leaderboard Widget */}
          <div className="glass-card rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Top Sứ Giả Xanh Tuần</span>
              </h3>
              <Link
                href="/leaderboard"
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="space-y-3">
              {topUsers.map((u, i) => (
                <div key={u.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 text-center font-bold ${
                        i === 0
                          ? 'text-amber-500'
                          : i === 1
                          ? 'text-slate-500'
                          : i === 2
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[110px]">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.rankTitle}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700">{u.greenPoints} GP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eco Community Guidelines */}
          <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 bg-emerald-50/30">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Tiêu chuẩn Cộng đồng Xanh</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Chia sẻ các hướng dẫn tái chế thực tế, có thể làm tại nhà.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Tôn trọng và khích lệ nỗ lực sống xanh của mọi thành viên.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Không quảng cáo các sản phẩm nhựa dùng 1 lần độc hại.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
