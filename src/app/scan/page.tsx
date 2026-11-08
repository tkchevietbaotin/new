'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import ScanUploader from '@/components/ScanUploader';
import ScanResultCard from '@/components/ScanResultCard';
import CreatePostModal from '@/components/CreatePostModal';
import { ScanResult } from '@/types';
import {
  Sparkles,
  History,
  Layers,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

export default function ScanPage() {
  const { scans, addScanResult, geminiApiKey } = useEcoStore();
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState<ScanResult | null>(null);

  const handleScanComplete = (result: ScanResult) => {
    // Add to global store & award points
    const saved = addScanResult(result);
    setCurrentResult(saved);
  };

  const handleShareToCommunity = (result: ScanResult) => {
    setItemToShare(result);
    setShareModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Vision Studio 2026</span>
          {geminiApiKey ? (
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
              Gemini 1.5 Active
            </span>
          ) : (
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
              Smart Simulator
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Quét & Phân Loại Rác Bằng AI
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Tải ảnh lên hoặc chụp từ camera. AI sẽ nhận diện chất liệu, đo lường tác động môi trường và hướng dẫn tái chế chi tiết.
        </p>
      </div>

      {/* Main Scanner or Result Card */}
      {currentResult ? (
        <ScanResultCard
          result={currentResult}
          onReset={() => setCurrentResult(null)}
          onShareToCommunity={handleShareToCommunity}
        />
      ) : (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-lg">
          <ScanUploader
            onScanComplete={handleScanComplete}
            isScanning={isScanning}
            setIsScanning={setIsScanning}
          />
        </div>
      )}

      {/* Recent Scans History Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Lịch sử các lần quét gần đây</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {scans.length} vật phẩm đã phân loại
          </span>
        </div>

        {scans.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            Chưa có lần quét nào. Hãy thử tải lên một món đồ ở trên!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scans.slice(0, 6).map((scan) => (
              <div
                key={scan.id}
                onClick={() => setCurrentResult(scan)}
                className="p-3.5 rounded-2xl glass-card border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
              >
                <img
                  src={scan.imageUrl}
                  alt={scan.itemName}
                  className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {scan.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{scan.timestamp}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 mt-1">
                    {scan.itemName}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span>Eco Score: <strong>{scan.ecoScore}/100</strong></span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> {scan.co2SavedKg}kg CO₂
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {itemToShare && (
        <CreatePostModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          defaultScanItem={itemToShare.itemName}
          defaultImage={itemToShare.imageUrl}
        />
      )}
    </div>
  );
}
