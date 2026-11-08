'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEcoStore } from '@/lib/store';
import {
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, users, switchUser } = useEcoStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!name.trim()) return;
      login(name.trim());
    } else {
      if (!email.trim()) return;
      login(email.trim());
    }
    router.push('/scan');
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    router.push('/scan');
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Leaf className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {isRegister ? 'Tạo Tài Khoản Sinh Thái' : 'Chào Mừng Trở Lại!'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Cùng mạng lưới EcoScan AI tích lũy Green Points và bảo vệ Trái Đất
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Họ và tên của bạn:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Minh Quân"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email hoặc Tên đăng nhập:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="baotin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required={!isRegister}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Mật khẩu:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>{isRegister ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Register/Login */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
          >
            {isRegister
              ? 'Đã có tài khoản? Đăng nhập ngay'
              : 'Chưa có tài khoản? Đăng ký thành viên mới'}
          </button>
        </div>

        {/* 1-Click Demo Quick Logins */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Hoặc Đăng Nhập Nhanh 1-Click (Tài khoản mẫu):
          </span>
          <div className="space-y-2">
            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{u.rankTitle}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">
                  {u.greenPoints} GP
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Bảo mật dữ liệu sinh thái cá nhân</span>
      </div>
    </div>
  );
}
