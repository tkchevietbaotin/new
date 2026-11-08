'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import {
  AlertTriangle,
  Wind,
  Sun,
  ShieldAlert,
  Flame,
  ThumbsUp,
  UserCheck,
  Plus,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { AlertSeverity } from '@/types';

export default function AlertsPage() {
  const { alerts, addAlert, upvoteAlert, joinAlertCampaign, user } = useEcoStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'campaign'>('all');

  // Report Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'waste_hotspot' | 'illegal_dumping' | 'clean_campaign'>('waste_hotspot');
  const [reportSeverity, setReportSeverity] = useState<AlertSeverity>('warning');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportImg, setReportImg] = useState('');

  const filteredAlerts = alerts.filter((alt) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'campaign') return alt.type === 'clean_campaign';
    return alt.severity === activeFilter;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportLocation.trim()) return;

    addAlert({
      title: reportTitle.trim(),
      description: reportDesc.trim(),
      type: reportType,
      severity: reportSeverity,
      status: 'active',
      location: reportLocation.trim(),
      reportedBy: user ? user.name : 'Người dân phản ánh',
      imageUrl: reportImg || undefined,
    });

    setShowReportModal(false);
    setReportTitle('');
    setReportLocation('');
    setReportDesc('');
    setReportImg('');
  };

  const getSeverityPill = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return { label: 'Báo động đỏ (Critical)', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'warning':
        return { label: 'Cảnh báo mức cao', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'Thông tin môi trường', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Hệ Thống Giám Sát & Cảnh Báo Môi Trường</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cảnh Báo Ô Nhiễm & Điểm Nóng Rác Thải
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi chỉ số chất lượng không khí (AQI), phát hiện các bãi rác tự phát và cùng nhau kêu gọi dọn sạch.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Báo cáo điểm ô nhiễm (+40 GP)</span>
        </button>
      </div>

      {/* Real-time Environmental Dashboard (AQI & UV Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hanoi AQI */}
        <div className="glass-card rounded-3xl p-5 border border-rose-200/90 shadow-xs space-y-2 bg-gradient-to-br from-rose-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-rose-500" /> Hà Nội (AQI)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              Kém (Unhealthy)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">158</span>
            <span className="text-xs text-slate-400 font-medium">PM2.5: 68 µg/m³</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Khuyến cáo đeo khẩu trang N95 khi ra đường và bật máy lọc không khí trong nhà.
          </p>
        </div>

        {/* HCMC AQI */}
        <div className="glass-card rounded-3xl p-5 border border-amber-200/90 shadow-xs space-y-2 bg-gradient-to-br from-amber-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-amber-500" /> TP. Hồ Chí Minh
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Trung bình (Moderate)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">72</span>
            <span className="text-xs text-slate-400 font-medium">PM2.5: 22 µg/m³</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Chất lượng không khí ở mức chấp nhận được, nhóm nhạy cảm nên hạn chế chạy bộ ngoài trời.
          </p>
        </div>

        {/* Da Nang AQI */}
        <div className="glass-card rounded-3xl p-5 border border-emerald-200/90 shadow-xs space-y-2 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-emerald-500" /> Đà Nẵng
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Tốt (Good)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">38</span>
            <span className="text-xs text-slate-400 font-medium">PM2.5: 9 µg/m³</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Không khí trong lành, rất thích hợp cho các hoạt động thể thao và sinh hoạt ngoài trời.
          </p>
        </div>

        {/* UV Index */}
        <div className="glass-card rounded-3xl p-5 border border-orange-200/90 shadow-xs space-y-2 bg-gradient-to-br from-orange-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-orange-500" /> Chỉ Số Tia UV
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Rất Cao (Very High)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600">8.6</span>
            <span className="text-xs text-slate-400 font-medium">Đỉnh điểm: 11h30 - 14h00</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Nguy cơ tổn thương da cao. Cần bôi kem chống nắng và mặc áo dài tay chống nắng.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tất cả cảnh báo ({alerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'critical'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
          }`}
        >
          Điểm nóng rác nguy cấp
        </button>
        <button
          onClick={() => setActiveFilter('campaign')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'campaign'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
          }`}
        >
          Chiến dịch ra quân dọn rác
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => {
          const pill = getSeverityPill(alert.severity);
          return (
            <div
              key={alert.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${pill.bg}`}>
                      {pill.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.reportedAt}
                    </span>
                    <span className="text-xs text-slate-400">
                      • Báo cáo bởi: <strong>{alert.reportedBy}</strong>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>{alert.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                    {alert.status === 'active' ? 'Đang diễn ra' : 'Đang ra quân xử lý'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {alert.description}
              </p>

              {/* Photo attachment if available */}
              {alert.imageUrl && (
                <div className="rounded-2xl overflow-hidden max-h-72 bg-slate-100">
                  <img
                    src={alert.imageUrl}
                    alt="Bằng chứng hiện trường"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action Buttons: Upvote / Join Campaign */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => upvoteAlert(alert.id)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Quan tâm ({alert.upvotes})</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{alert.volunteersJoined} người đã tham gia</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => joinAlertCampaign(alert.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all transform active:scale-95 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Đăng ký chung tay dọn dẹp (+50 GP)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Báo cáo điểm ô nhiễm môi trường</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu đề cảnh báo:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bãi rác tự phát bốc mùi hôi thối chân cầu..."
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại sự cố:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="waste_hotspot">Bãi rác tự phát</option>
                    <option value="illegal_dumping">Đổ trộm rác thải / hóa chất</option>
                    <option value="clean_campaign">Kêu gọi chiến dịch dọn rác</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức độ cảnh báo:</label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as AlertSeverity)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="critical">Nguy cấp (Cần xử lý ngay)</option>
                    <option value="warning">Cảnh báo cao</option>
                    <option value="info">Thông tin chung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa điểm cụ thể:</label>
                <input
                  type="text"
                  placeholder="Tên đường, phường, quận, cột mốc dễ nhận diện..."
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả hiện trạng:</label>
                <textarea
                  rows={3}
                  placeholder="Loại rác thải, thể tích ước tính, ảnh hưởng đến người dân xung quanh..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Link ảnh hiện trường (tùy chọn):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={reportImg}
                  onChange={(e) => setReportImg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30"
                >
                  Đăng cảnh báo (+40 GP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
