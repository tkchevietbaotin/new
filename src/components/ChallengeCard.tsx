'use client';

import React from 'react';
import { Challenge } from '@/types';
import { useEcoStore } from '@/lib/store';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { claimChallenge } = useEcoStore();
  const percent = Math.min(100, Math.round((challenge.progress / challenge.maxProgress) * 100));

  const handleClaim = () => {
    claimChallenge(challenge.id);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        colors: ['#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
            {challenge.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {challenge.category}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-800 mt-1">
              {challenge.title}
            </h4>
          </div>
        </div>

        {/* Reward Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>+{challenge.rewardPoints} GP</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {challenge.description}
      </p>

      {/* Progress Bar & Actions */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {challenge.expiresIn}
          </span>
          <span className="text-emerald-700">
            {challenge.progress} / {challenge.maxProgress} ({percent}%)
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              challenge.completed
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Completion status or Claim button */}
        <div className="pt-2">
          {challenge.completed ? (
            <div className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành xuất sắc!</span>
            </div>
          ) : challenge.progress >= challenge.maxProgress ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nhận thưởng {challenge.rewardPoints} Green Points</span>
            </button>
          ) : (
            <div className="text-center py-1">
              <span className="text-[11px] text-slate-400 font-medium">
                Tiếp tục quét rác & chia sẻ để hoàn thành thử thách
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
