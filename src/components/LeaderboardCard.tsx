'use client';

import React from 'react';
import { User } from '@/types';
import { Trophy, Medal, Sparkles, Award } from 'lucide-react';

interface LeaderboardCardProps {
  users: User[];
  currentUserId?: string;
}

export default function LeaderboardCard({ users, currentUserId }: LeaderboardCardProps) {
  // Sort users by greenPoints descending
  const sortedUsers = [...users].sort((a, b) => b.greenPoints - a.greenPoints);
  const top1 = sortedUsers[0];
  const top2 = sortedUsers[1];
  const top3 = sortedUsers[2];

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4">
        {/* Top 2 Silver */}
        {top2 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-slate-300 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 border border-slate-400 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs">
                2
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 text-center truncate max-w-[90px]">
              {top2.name}
            </p>
            <p className="text-[11px] font-extrabold text-emerald-600">{top2.greenPoints} GP</p>
            <div className="w-full h-16 sm:h-20 mt-2 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl flex items-center justify-center border-t border-slate-300">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        )}

        {/* Top 1 Gold (Highest) */}
        {top1 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Trophy className="w-6 h-6 text-amber-500 fill-amber-400 animate-bounce" />
              </div>
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-md">
                1
              </span>
            </div>
            <p className="text-xs sm:text-base font-black text-slate-800 text-center truncate max-w-[110px]">
              {top1.name}
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-amber-600">{top1.greenPoints} GP</p>
            <div className="w-full h-24 sm:h-28 mt-2 bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 rounded-t-2xl flex items-center justify-center border-t-2 border-amber-300 shadow-sm">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Quán Quân Xanh
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Bronze */}
        {top3 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-amber-700/40 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                3
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 text-center truncate max-w-[90px]">
              {top3.name}
            </p>
            <p className="text-[11px] font-extrabold text-emerald-600">{top3.greenPoints} GP</p>
            <div className="w-full h-12 sm:h-14 mt-2 bg-gradient-to-t from-amber-100/60 to-slate-100 rounded-t-2xl flex items-center justify-center border-t border-amber-200">
              <Medal className="w-5 h-5 text-amber-700" />
            </div>
          </div>
        )}
      </div>

      {/* Full Ranked Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 divide-y divide-slate-100 shadow-sm">
        {sortedUsers.map((u, index) => {
          const isCurrent = u.id === currentUserId;
          return (
            <div
              key={u.id}
              className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                isCurrent ? 'bg-emerald-50/80 font-bold border-l-4 border-l-emerald-500' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 text-center text-xs sm:text-sm font-bold ${
                    index === 0
                      ? 'text-amber-500'
                      : index === 1
                      ? 'text-slate-500'
                      : index === 2
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}
                >
                  #{index + 1}
                </span>
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {u.name}
                      {isCurrent && (
                        <span className="ml-1.5 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          Bạn
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>{u.rankTitle}</span>
                    <span className="hidden sm:inline">• {u.scanCount} lần quét</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-sm sm:text-base">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>{u.greenPoints}</span>
                  <span className="text-[10px] text-emerald-500 font-medium">GP</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {u.co2SavedKg}kg CO₂ giảm
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
