'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { analyzeImage } from '@/lib/ai-service';
import { ScanResult } from '@/types';
import { useEcoStore } from '@/lib/store';

interface ScanUploaderProps {
  onScanComplete: (result: ScanResult) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

// Preset realistic samples for instant one-click testing
const PRESET_SAMPLES = [
  {
    name: 'Chai nhựa PET',
    category: 'Nhựa #1',
    url: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=500&q=80',
    fileName: 'chai_nhua_aquafina_pet.jpg',
  },
  {
    name: 'Vỏ lon nhôm',
    category: 'Kim loại',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80',
    fileName: 'vo_lon_nhom_coca.jpg',
  },
  {
    name: 'Bìa carton sóng',
    category: 'Giấy',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80',
    fileName: 'hop_carton_dong_hang.jpg',
  },
  {
    name: 'Bã cà phê & Chuối',
    category: 'Hữu cơ',
    url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=500&q=80',
    fileName: 'rac_huu_co_ba_ca_phe.jpg',
  },
  {
    name: 'Pin tiểu AA cũ',
    category: 'Nguy hại',
    url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80',
    fileName: 'pin_tieu_aa_cu.jpg',
  },
];

export default function ScanUploader({
  onScanComplete,
  isScanning,
  setIsScanning,
}: ScanUploaderProps) {
  const { geminiApiKey } = useEcoStore();
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo AI Engine...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startAnalysis = async (base64Img: string, fileName?: string) => {
    setIsScanning(true);
    setSelectedPreview(base64Img);

    // Dynamic scanning step messages for immersive UX
    setStatusMessage('Đang phân tích phổ quang và hình thái vật thể...');
    const t1 = setTimeout(() => {
      setStatusMessage('Đang đối chiếu chất liệu phân tử & khả năng phân hủy...');
    }, 500);
    const t2 = setTimeout(() => {
      setStatusMessage('Đang tính toán Eco Score & lượng CO2 phát thải...');
    }, 1000);

    try {
      const result = await analyzeImage({
        imageBase64: base64Img,
        fileName,
        apiKey: geminiApiKey,
      });
      onScanComplete(result);
    } catch (err) {
      console.error(err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          startAnalysis(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          startAnalysis(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error(err);
      setCameraError('Không thể mở camera. Vui lòng cấp quyền truy cập hoặc sử dụng tính năng tải ảnh.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        startAnalysis(dataUrl, 'camera_capture.jpg');
      }
    }
  };

  const handleSampleClick = async (sample: (typeof PRESET_SAMPLES)[0]) => {
    setIsScanning(true);
    setSelectedPreview(sample.url);
    try {
      // Convert external image to base64 if needed or send direct url
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        startAnalysis(base64data, sample.fileName);
      };
      reader.readAsDataURL(blob);
    } catch {
      startAnalysis(sample.url, sample.fileName);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all p-6 sm:p-10 text-center ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
        } ${isScanning ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera View */}
        {cameraActive ? (
          <div className="relative max-w-lg mx-auto overflow-hidden rounded-2xl bg-black shadow-lg">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-72 sm:h-80 object-cover"
            />
            {/* Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/80 rounded-2xl border-dashed animate-pulse flex items-center justify-center">
                <span className="text-[11px] text-white bg-black/60 px-2.5 py-1 rounded-full font-medium">
                  Đặt vật phẩm vào đây
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/80 hover:bg-white text-slate-800 backdrop-blur-xs transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-4 h-4" /> Chụp & Quét AI
              </button>
            </div>
          </div>
        ) : isScanning ? (
          /* Scanning Laser Radar Animation */
          <div className="py-8 space-y-5">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-500/40 bg-slate-900">
              {selectedPreview && (
                <img
                  src={selectedPreview}
                  alt="Analyzing preview"
                  className="w-full h-full object-cover opacity-75"
                />
              )}
              {/* Laser scanning bar */}
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scan" />
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI Vision Đang Xử Lý</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 animate-pulse">
                {statusMessage}
              </p>
              <p className="text-xs text-slate-400">
                Đang nhận diện danh mục rác thải và đối chiếu bộ quy chuẩn sinh thái...
              </p>
            </div>
          </div>
        ) : (
          /* Default Upload Interface */
          <div className="py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <UploadCloud className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                Kéo thả ảnh hoặc Tải ảnh vật phẩm lên đây
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Hỗ trợ ảnh chụp chai nhựa, đồ hộp, bao bì thực phẩm, giấy báo, linh kiện điện tử...
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <ImageIcon className="w-4 h-4" /> Chọn ảnh từ máy
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-400" /> Bật Camera trực tiếp
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-500 font-medium pt-2">{cameraError}</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Test Samples */}
      {!cameraActive && !isScanning && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Thử nghiệm nhanh 1-Click (Dữ liệu mẫu thực tế):
            </span>
            <span className="text-[11px] text-slate-400">Không cần chuẩn bị ảnh</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PRESET_SAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(item)}
                className="flex items-center gap-2 p-2 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs transition-all text-left group"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
