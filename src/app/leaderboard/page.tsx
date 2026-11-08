'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import LeaderboardCard from '@/components/LeaderboardCard';
import ChallengeCard from '@/components/ChallengeCard';
import { Trophy, Target, Sparkles, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const { users, user, challenges } = useEcoStore();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Vinh Danh Hành Động Xanh 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Bảng Xếp Hạng & Thử Thách
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Tích lũy Green Points thông qua việc phân loại rác thải, đăng bài và hoàn thành thử thách tuần.
        </p>
      </div>

      {/* Navigation Switch Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Xếp Hạng ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'challenges'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Thử Thách Tuần ({challenges.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'leaderboard' ? (
        <LeaderboardCard users={users} currentUserId={user?.id} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Nhiệm vụ nhận Green Points tuần này</span>
            </h3>
            <span className="text-xs text-slate-400">Tự động cập nhật tiến độ khi quét</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {challenges.map((ch) => (
              <ChallengeCard key={ch.id} challenge={ch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
