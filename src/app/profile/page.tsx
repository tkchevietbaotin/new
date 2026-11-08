'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import {
  User as UserIcon,
  Award,
  Sparkles,
  TrendingDown,
  Scan,
  Calendar,
  Edit3,
  Check,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, scans, posts, updateUserBio } = useEcoStore();
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || '');

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Bạn chưa đăng nhập</h2>
        <p className="text-xs text-slate-500">
          Hãy đăng nhập để lưu trữ lịch sử quét, điểm Green Points và huy hiệu sinh thái.
        </p>
        <Link
          href="/auth"
          className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleSaveBio = () => {
    updateUserBio(bioInput);
    setEditingBio(false);
  };

  const userPosts = posts.filter((p) => p.author.id === user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-lg relative overflow-hidden">
        {/* Background gradient banner */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-forest-800 pointer-events-none" />

        <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black shadow-md border-2 border-white">
                TOP #{user.ecoRank}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  {user.rankTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
              <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Tham gia: {user.joinedDate}
              </p>
            </div>
          </div>

          {/* Green Points Pill */}
          <div className="bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200/80 px-5 py-3 rounded-2xl text-center self-stretch sm:self-auto shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Điểm Sinh Thái
            </span>
            <div className="flex items-center justify-center gap-1 text-2xl font-black text-emerald-700">
              <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              <span>{user.greenPoints}</span>
              <span className="text-xs font-semibold text-emerald-600">GP</span>
            </div>
          </div>
        </div>

        {/* Bio Edit Section */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          {editingBio ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSaveBio}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Lưu
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <p className="italic">{user.bio || 'Chưa cập nhật tiểu sử...'}</p>
              <button
                onClick={() => {
                  setBioInput(user.bio);
                  setEditingBio(true);
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 ml-2 flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" /> Sửa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-emerald-100 text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <Scan className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-800 pt-1">{user.scanCount}</p>
          <p className="text-xs font-medium text-slate-500">Món đồ đã quét phân loại</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-emerald-100 text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-emerald-700 pt-1">
            {user.co2SavedKg} <span className="text-xs text-slate-400">kg</span>
          </p>
          <p className="text-xs font-medium text-slate-500">CO₂ ngăn ngừa phát thải</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-emerald-100 text-center space-y-1 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-800 pt-1">{userPosts.length}</p>
          <p className="text-xs font-medium text-slate-500">Bài viết đóng góp cộng đồng</p>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Kho Huy Hiệu Sinh Thái ({user.badges.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Thu thập từ các hành động xanh</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="glass-card rounded-2xl p-4 border border-emerald-100 flex items-start gap-3 hover:border-emerald-300 transition-all"
            >
              <div className="text-3xl p-2 rounded-xl bg-emerald-50 border border-emerald-200/60 flex-shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">{badge.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {badge.description}
                </p>
                {badge.unlockedAt && (
                  <span className="inline-block text-[10px] text-emerald-600 font-semibold mt-1">
                    Đã mở khóa: {badge.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
