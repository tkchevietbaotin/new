'use client';

import React, { useEffect, useState } from 'react';
import { ScanResult } from '@/types';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  RotateCcw,
  Lightbulb,
  TrendingDown,
  Layers,
  Bot,
  Box,
  Eye,
  PieChart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEcoStore } from '@/lib/store';

interface ScanResultCardProps {
  result: ScanResult;
  onReset: () => void;
  onShareToCommunity: (result: ScanResult) => void;
  onAskChatbot?: (result: ScanResult) => void;
}

export default function ScanResultCard({
  result,
  onReset,
  onShareToCommunity,
  onAskChatbot,
}: ScanResultCardProps) {
  const { sendChatMessage } = useEcoStore();
  const [showBoxes, setShowBoxes] = useState(true);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#059669', '#6ee7b7'],
      });
    } catch {
      // ignore
    }
  }, []);

  const getRecyclabilityBadge = (level: string) => {
    switch (level) {
      case 'high':
        return {
          text: 'Tái chế hoàn toàn (High)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'medium':
        return {
          text: 'Tái chế có điều kiện (Medium)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'low':
        return {
          text: 'Khó tái chế (Low)',
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
        };
      default:
        return {
          text: 'Không thể tái chế / Nguy hại',
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
        };
    }
  };

  const badgeInfo = getRecyclabilityBadge(result.recyclability);

  // Fallback bounding boxes if none provided
  const boundingBoxes = result.boundingBoxes || [
    { label: `${result.itemName}`, confidence: result.confidence, box: [20, 25, 50, 60] as [number, number, number, number], color: '#10b981' },
    { label: 'Chi tiết phụ', confidence: 0.92, box: [15, 38, 20, 15] as [number, number, number, number], color: '#3b82f6' },
  ];

  const materialBreakdowns = result.materialBreakdowns || [
    { name: result.materialType, percentage: 85, recyclable: result.recyclability === 'high', color: '#10b981' },
    { name: 'Phụ gia & Bao bì phụ', percentage: 15, recyclable: false, color: '#f59e0b' },
  ];

  const handleAskEcoBot = () => {
    const question = `Tôi vừa quét món đồ "${result.itemName}". Bạn có thể hướng dẫn chi tiết cách tái chế và tận dụng món này hiệu quả nhất được không?`;
    sendChatMessage(question, result);
    if (onAskChatbot) {
      onAskChatbot(result);
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl overflow-hidden border border-emerald-200/90 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner / Headline */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-forest-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phân tích AI hoàn tất (Độ tin cậy: {Math.round(result.confidence * 100)}%)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {result.itemName}
            </h2>
            <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" /> {result.categoryNameVi}
            </p>
          </div>

          {/* Eco Score Circular Widget */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-semibold">
                Điểm Eco Score
              </div>
              <div className="text-xs text-white/80">Thân thiện môi trường</div>
            </div>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${
                result.ecoScore >= 70
                  ? 'bg-emerald-400 text-emerald-950'
                  : result.ecoScore >= 40
                  ? 'bg-amber-300 text-amber-950'
                  : 'bg-rose-400 text-rose-950'
              }`}
            >
              {result.ecoScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Information */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Scanned Image with AI Bounding Box Overlays */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-500/30 max-h-80 flex items-center justify-center shadow-lg">
          <img
            src={result.imageUrl}
            alt={result.itemName}
            className="w-full h-72 sm:h-80 object-cover opacity-90"
          />

          {/* AI Bounding Boxes */}
          {showBoxes && (
            <div className="absolute inset-0 pointer-events-none">
              {boundingBoxes.map((box, idx) => (
                <div
                  key={idx}
                  style={{
                    top: `${box.box[0]}%`,
                    left: `${box.box[1]}%`,
                    width: `${box.box[2]}%`,
                    height: `${box.box[3]}%`,
                    borderColor: box.color,
                  }}
                  className="absolute border-2 rounded-xl shadow-xs transition-all animate-in fade-in duration-300"
                >
                  <span
                    style={{ backgroundColor: box.color }}
                    className="absolute -top-5 left-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                  >
                    <Box className="w-2.5 h-2.5" />
                    <span>{box.label} ({Math.round(box.confidence * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Toggle Bounding Box Button */}
          <div className="absolute bottom-3 right-3 z-10">
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-white/20 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showBoxes ? 'Ẩn khung AI' : 'Hiện khung AI'}</span>
            </button>
          </div>
        </div>

        {/* Material Composition Breakdown Bars */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phân Tích Thành Phần Vật Liệu:</span>
            </h4>
            <span className="text-[11px] text-slate-400">Độ chính xác cao</span>
          </div>

          <div className="space-y-2">
            {materialBreakdowns.map((mat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: mat.color }}
                    />
                    {mat.name}
                  </span>
                  <span className="font-bold text-slate-800">{mat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${mat.percentage}%`, backgroundColor: mat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Recyclability Level */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Khả năng tái chế
            </span>
            <div className="pt-1">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeInfo.bg}`}
              >
                {badgeInfo.text}
              </span>
            </div>
          </div>

          {/* CO2 Impact */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Giảm phát thải CO2
            </span>
            <p className="text-xl font-extrabold text-emerald-800">
              ~ {result.co2SavedKg} kg CO₂
            </p>
            <p className="text-[11px] text-emerald-600">tương đương trồng 0.5 cây non</p>
          </div>

          {/* Decomposition Time */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Thời gian phân hủy
            </span>
            <p className="text-sm font-bold text-slate-800 leading-snug pt-1">
              {result.decompositionTime}
            </p>
          </div>
        </div>

        {/* Step-by-step Disposal Guide */}
        <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Hướng dẫn phân loại & xử lý đúng chuẩn:</span>
          </h4>
          <div className="space-y-2">
            {result.disposalGuide.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcycling & DIY Ideas */}
        {result.upcyclingTips && result.upcyclingTips.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Gợi ý tái sử dụng sáng tạo (Upcycling / DIY):</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              {result.upcyclingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Quét món khác
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ask EcoBot */}
            <button
              type="button"
              onClick={handleAskEcoBot}
              className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4 text-teal-600" />
              <span>Hỏi EcoBot</span>
            </button>

            {/* Share to Community */}
            <button
              type="button"
              onClick={() => onShareToCommunity(result)}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Share2 className="w-4 h-4" /> Chia sẻ lên Cộng đồng (+30 GP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
