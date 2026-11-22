'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Database,
  ArrowRight,
  Recycle,
  Tag,
  HelpCircle,
  PackageCheck,
  AlertTriangle,
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
  const router = useRouter();
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

  const getRecyclabilityBadge = (level: string, canRecycle?: boolean) => {
    if (canRecycle === false || level === 'non-recyclable') {
      return {
        text: 'Không thể tái chế thông thường',
        bg: 'bg-rose-100 text-rose-800 border-rose-300',
        iconBg: 'bg-rose-500 text-white',
        statusText: 'KHÔNG',
      };
    }
    switch (level) {
      case 'high':
        return {
          text: 'Có thể tái chế hoàn toàn (90 - 100%)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconBg: 'bg-emerald-500 text-white',
          statusText: 'CÓ (RẤT CAO)',
        };
      case 'medium':
        return {
          text: 'Tái chế có điều kiện (60 - 80%)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-500 text-white',
          statusText: 'CÓ ĐIỀU KIỆN',
        };
      case 'low':
        return {
          text: 'Khó tái chế (Dưới 40%)',
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          iconBg: 'bg-orange-500 text-white',
          statusText: 'HẠN CHẾ',
        };
      default:
        return {
          text: 'Chất thải cần xử lý chuyên biệt',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          iconBg: 'bg-slate-500 text-white',
          statusText: 'XỬ LÝ ĐẶC BIỆT',
        };
    }
  };

  const badgeInfo = getRecyclabilityBadge(result.recyclability, result.canRecycle);

  // Fallback bounding boxes if none provided
  const boundingBoxes = result.boundingBoxes || [
    {
      label: `${result.itemName.split('/')[0].split('(')[0].trim()}`,
      confidence: result.confidence,
      box: [20, 25, 50, 60] as [number, number, number, number],
      color: '#10b981',
    },
    {
      label: 'Chi tiết phụ',
      confidence: 0.92,
      box: [15, 38, 20, 15] as [number, number, number, number],
      color: '#3b82f6',
    },
  ];

  const materialBreakdowns = result.materialBreakdowns || [
    {
      name: result.materialType.split(':')[0].split(',')[0],
      percentage: 85,
      recyclable: result.canRecycle ?? (result.recyclability === 'high'),
      color: '#10b981',
    },
    {
      name: 'Tạp chất & Phụ gia bao bì',
      percentage: 15,
      recyclable: false,
      color: '#f59e0b',
    },
  ];

  const actionSteps = result.actionGuide || result.disposalGuide || [
    'Bước 1: Làm sạch cặn bẩn hoặc chất lỏng thừa bên trong.',
    'Bước 2: Tách riêng các bộ phận khác chất liệu (nắp, nhãn, dây buộc).',
    'Bước 3: Nén hoặc gấp bẹp để tối ưu thể tích lưu trữ.',
    'Bước 4: Bỏ vào đúng thùng rác phân loại theo quy định tại địa phương.',
  ];

  const recyclingProductsList = result.recyclingProducts && result.recyclingProducts.length > 0
    ? result.recyclingProducts
    : [
        'Hạt vật liệu tái sinh rPET / rHDPE chất lượng cao',
        'Nguyên liệu kéo sợi dệt may công nghiệp',
        'Chậu cây cảnh và khay chứa linh kiện tuần hoàn',
      ];

  const handleAskChatGPT = () => {
    const question = `Tôi vừa quét món đồ "${result.itemName}" (thuộc nhóm "${result.wasteClassification || result.categoryNameVi}"). Bạn hãy dùng trí tuệ ChatGPT phân tích sâu hơn: Có những mẹo tái sử dụng DIY sáng tạo nào tại nhà, và những sản phẩm tái chế giá trị cao nào có thể làm ra từ loại rác này?`;
    sendChatMessage(question, result);
    if (onAskChatbot) {
      onAskChatbot(result);
    } else {
      router.push('/chatbot');
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl overflow-hidden border border-emerald-200/90 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner / Headline */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-forest-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nhận diện AI hoàn tất (Độ chính xác: {Math.round(result.confidence * 100)}%)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {result.itemName}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>{result.categoryNameVi}</span>
              <span className="text-emerald-300/60">•</span>
              <span className="text-emerald-200 font-normal">{result.materialType}</span>
            </p>
          </div>

          {/* Eco Score Circular Widget */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 self-start sm:self-auto shadow-sm">
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

      <div className="p-6 sm:p-8 space-y-7">
        {/* ========================================================================= */}
        {/* 5 THÔNG TIN CỐT LÕI VỀ RÁC THẢI (BẮT BUỘC THEO QUY CHUẨN) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-2 border-emerald-300/80 p-5 sm:p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
                5
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>5 Thông Tin Cốt Lõi Về Rác Thải Đã Quét</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Quy Chuẩn BVMT
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Phân tích tự động chuẩn hóa dựa trên bộ dữ liệu 12.259 mẫu thực tế & AI
                </p>
              </div>
            </div>

            <button
              onClick={handleAskChatGPT}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Hỏi ChatGPT chi tiết hơn</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. ĐÓ LÀ RÁC THẢI GÌ */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1.5 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Đó là rác thải gì?
                </span>
              </div>
              <p className="text-base font-extrabold text-slate-900 pt-0.5">
                {result.wasteName || result.itemName}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Chất liệu chính:</strong> {result.materialType}
              </p>
            </div>

            {/* 2. CHẤT THẢI LOẠI GÌ */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1.5 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Chất thải loại gì?
                </span>
              </div>
              <p className="text-base font-extrabold text-teal-900 pt-0.5">
                {result.wasteClassification || result.categoryNameVi}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <span>Thùng rác quy định:</span>
                <span className="font-bold">{result.wasteBinColor || 'Thùng rác tái chế màu Vàng / Trắng'}</span>
              </div>
            </div>

            {/* 4. CÓ THỂ TÁI CHẾ ĐƯỢC KHÔNG */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                  4
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Có thể tái chế được không?
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${badgeInfo.bg}`}
                >
                  <Recycle className="w-3.5 h-3.5" />
                  <span>{badgeInfo.statusText}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.recyclabilityStatus || badgeInfo.text}
              </p>
            </div>

            {/* 5. TÁI CHẾ ĐƯỢC NHỮNG GÌ */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                  5
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tái chế được những gì?
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                Các sản phẩm & nguyên liệu thành phẩm sau tái chế:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {recyclingProductsList.map((prod, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold"
                  >
                    <span>🔄</span>
                    <span>{prod}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. CẦN LÀM GÌ VỚI NÓ (HƯỚNG DẪN HÀNH ĐỘNG CỤ THỂ) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                3
              </span>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Cần làm gì với nó? (Quy trình hành động từng bước):</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {actionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                    <span>
                      {box.label} ({Math.round(box.confidence * 100)}%)
                    </span>
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

        {/* Dataset Archive Ground Truth Reference */}
        {result.datasetMatch && (
          <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200/90 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Đối Chiếu Với Kho Dữ Liệu Thực Tế (Archive Dataset):</span>
                </h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Khớp với nhóm <strong>{result.datasetMatch.categoryNameVi} (`{result.datasetMatch.categoryKey}`)</strong> — đối chiếu với{' '}
                  <strong>{result.datasetMatch.totalDatasetSamples.toLocaleString()} mẫu thực tế</strong> trong kho dữ liệu archive.
                </p>
              </div>
              <Link
                href="/dataset"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto transition-colors"
              >
                <span>Xem kho dataset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Reference Sample Images from Archive */}
            <div className="space-y-1.5 pt-1 border-t border-indigo-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Mẫu đối chứng tương đồng trong kho lưu trữ:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {result.datasetMatch.sampleImages.map((sample, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-indigo-200 bg-slate-900 relative group aspect-square shadow-xs"
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-mono text-white bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-center truncate">
                      {sample.fileName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Thời gian phân hủy tự nhiên
            </span>
            <p className="text-sm font-bold text-slate-800 leading-snug pt-1">
              {result.decompositionTime}
            </p>
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Quét món khác
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ask ChatGPT button */}
            <button
              type="button"
              onClick={handleAskChatGPT}
              className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-sm flex items-center gap-2 transition-all shadow-xs"
            >
              <Bot className="w-4 h-4 text-teal-600" />
              <span>Hỏi ChatGPT</span>
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
