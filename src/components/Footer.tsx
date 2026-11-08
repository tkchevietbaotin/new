import React from 'react';
import Link from 'next/link';
import { Leaf, Heart, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-12 border-t border-emerald-900/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Eco<span className="text-emerald-400">Scan</span> AI
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Nền tảng trí tuệ nhân tạo nhận diện và phân loại rác thải thông minh, kết nối cộng đồng hành động vì một lối sống không rác thải (Zero-Waste) và tương lai xanh bền vững.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2 font-medium">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Vì Trái Đất Xanh
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Phân Loại Rác
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Tính năng</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/scan" className="hover:text-emerald-400 transition-colors">
                  Quét AI phân loại rác
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-emerald-400 transition-colors">
                  Eco Feed cộng đồng
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">
                  Bảng xếp hạng Green Points
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                  Hồ sơ & Huy hiệu sinh thái
                </Link>
              </li>
            </ul>
          </div>

          {/* Eco Principles */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Quy tắc 5R</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• <strong>Refuse:</strong> Từ chối đồ nhựa dùng 1 lần</li>
              <li>• <strong>Reduce:</strong> Giảm thiểu tiêu dùng dư thừa</li>
              <li>• <strong>Reuse:</strong> Tái sử dụng mọi vật dụng có thể</li>
              <li>• <strong>Repurpose:</strong> Sáng tạo công năng mới (DIY)</li>
              <li>• <strong>Recycle:</strong> Tái chế đúng cách với AI</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EcoScan AI Platform. Chung tay bảo vệ hành tinh xanh.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> cho môi trường
          </p>
        </div>
      </div>
    </footer>
  );
}
