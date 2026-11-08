'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEcoStore } from '@/lib/store';
import {
  Scan,
  Users,
  Trophy,
  User,
  Leaf,
  Sparkles,
  Menu,
  X,
  Key,
  LogOut,
  ChevronDown,
  Award,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, geminiApiKey, setGeminiApiKey, users, switchUser } = useEcoStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [userDropdown, setUserDropdown] = useState(false);

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Leaf },
    { href: '/scan', label: 'Quét AI', icon: Scan, highlight: true },
    { href: '/community', label: 'Cộng đồng', icon: Users },
    { href: '/leaderboard', label: 'Xếp hạng & Thử thách', icon: Trophy },
  ];

  const handleSaveKey = () => {
    setGeminiApiKey(keyInput.trim());
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight flex items-center gap-1">
                  Eco<span className="text-emerald-600">Scan</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ml-1 border border-emerald-200">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Phân loại rác thông minh
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      link.highlight
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 hover:opacity-95 hover:shadow-lg'
                        : isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.highlight ? 'text-emerald-100' : ''}`} />
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Points, API Key & User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* API Key Modal Button */}
              <button
                onClick={() => {
                  setKeyInput(geminiApiKey);
                  setShowKeyModal(true);
                }}
                title="Cấu hình Google Gemini API Key"
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  geminiApiKey
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline">
                  {geminiApiKey ? 'Gemini AI: Bật' : 'API Key'}
                </span>
              </button>

              {user ? (
                <>
                  {/* Green Points Pill */}
                  <Link
                    href="/leaderboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs hover:border-emerald-300 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                    <span>{user.greenPoints}</span>
                    <span className="text-[11px] font-medium text-emerald-600 hidden sm:inline">
                      GP
                    </span>
                  </Link>

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all text-left"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 max-w-[90px] truncate hidden sm:inline">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {userDropdown && (
                      <div
                        className="absolute right-0 mt-2 w-64 rounded-2xl glass-card shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        onClick={() => setUserDropdown(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-semibold text-slate-400">Đang đăng nhập:</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                            <Award className="w-3 h-3" /> {user.rankTitle}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>Hồ sơ & Huy hiệu sinh thái</span>
                        </Link>

                        <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 border-t border-slate-100">
                          Đổi nhanh tài khoản mẫu:
                        </div>
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => switchUser(u.id)}
                            className={`w-full flex items-center justify-between px-4 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                              u.id === user.id ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-600'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] text-slate-400">{u.greenPoints} GP</span>
                          </button>
                        ))}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <User className="w-5 h-5 text-emerald-600" />
                <span>Hồ sơ cá nhân ({user.name})</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white"
              >
                Đăng nhập / Đăng ký
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                <Key className="w-5 h-5" />
                <span>Cấu hình Gemini Vision API</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Ứng dụng có sẵn <strong>Bộ mô phỏng Smart AI Simulator</strong> với dữ liệu hơn 15 loại rác thải thực tế. Nếu bạn muốn kết nối trực tiếp với mô hình <strong>Gemini 1.5 Flash Vision</strong> từ Google, hãy dán API key của bạn vào đây:
              </p>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Khóa API được lưu cục bộ trên trình duyệt của bạn (LocalStorage) và không chia sẻ ra ngoài.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setKeyInput('');
                  setGeminiApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Xóa key / Dùng Simulator
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
