'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Zap,
  SwitchCamera,
  AlertCircle,
  HelpCircle,
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
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo AI Engine...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Callback ref for video element to guarantee stream is attached immediately when mounted
  const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      element
        .play()
        .catch((err) => console.warn('Video playback notice:', err));
    }
  }, []);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startAnalysis = async (base64Img: string, fileName?: string) => {
    setIsScanning(true);
    setSelectedPreview(base64Img);

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

  // Robust cross-platform camera starter (Mac, iPhone, Android, Windows)
  const startCamera = async (preferredFacing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Trình duyệt hiện tại không hỗ trợ Web Camera trực tiếp. Hãy chọn "Chụp ảnh từ thiết bị" hoặc "Tải ảnh từ máy".');
      return;
    }

    let stream: MediaStream | null = null;

    try {
      // 1. First attempt: with requested facingMode (ideal, not exact, to avoid OverconstrainedError)
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: preferredFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (err1: any) {
      console.warn('Attempt with facingMode failed, falling back to default camera:', err1);
      try {
        // 2. Second attempt: simple fallback for laptops/Macs without back camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err2: any) {
        console.error('Camera access failed completely:', err2);
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          setCameraError('Quyền truy cập Camera đã bị từ chối. Vui lòng bấm vào biểu tượng ổ khóa hoặc camera trên thanh địa chỉ trình duyệt để cấp quyền.');
        } else if (err2.name === 'NotFoundError' || err2.name === 'DevicesNotFoundError') {
          setCameraError('Không tìm thấy thiết bị Camera trên máy này.');
        } else {
          setCameraError(`Không thể mở Camera (${err2.message || 'Lỗi không xác định'}). Bạn có thể dùng tính năng "Chụp ảnh từ thiết bị" hoặc tải ảnh lên.`);
        }
        return;
      }
    }

    if (stream) {
      streamRef.current = stream;
      setCameraActive(true);

      // If video element is already mounted, attach immediately
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn(err));
      }
    }
  };

  // Toggle front/back camera
  const toggleCameraFacing = async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    await startCamera(nextFacing);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror if user-facing camera
        if (cameraFacing === 'user') {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        startAnalysis(dataUrl, 'camera_capture.jpg');
      }
    }
  };

  const handleSampleClick = async (sample: (typeof PRESET_SAMPLES)[0]) => {
    setIsScanning(true);
    setSelectedPreview(sample.url);
    try {
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
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {/* Native mobile camera fallback input (works on all smartphones without permission prompt) */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera View */}
        {cameraActive ? (
          <div className="relative max-w-lg mx-auto overflow-hidden rounded-3xl bg-black shadow-2xl border-4 border-emerald-500/50">
            <video
              ref={setVideoRef}
              playsInline
              autoPlay
              muted
              className={`w-full h-72 sm:h-80 object-cover ${
                cameraFacing === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-emerald-400 rounded-3xl border-dashed animate-pulse flex flex-col items-center justify-between p-3">
                <span className="text-[10px] text-white bg-black/60 px-2.5 py-0.5 rounded-full font-bold backdrop-blur-md">
                  Căn giữa vật phẩm vào khung
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full font-bold">
                  Camera Đang Hoạt Động
                </span>
              </div>
            </div>

            {/* Top Toolbar: Switch Camera & Close */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
              <button
                type="button"
                onClick={toggleCameraFacing}
                title="Đổi camera trước/sau"
                className="p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <SwitchCamera className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">
                  {cameraFacing === 'environment' ? 'Camera Sau' : 'Camera Trước'}
                </span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md text-xs font-semibold transition-all"
              >
                Đóng
              </button>
            </div>

            {/* Bottom Toolbar: Capture Photo */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 z-10">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/50 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Chụp & Quét AI Ngay</span>
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
              {/* Button 1: Live Webcam Stream */}
              <button
                type="button"
                onClick={() => startCamera('environment')}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-400" /> Bật Camera trực tiếp
              </button>

              {/* Button 2: Native Camera Trigger (Mobile capture/Snapshot) */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95 sm:hidden"
              >
                <Camera className="w-4 h-4" /> Chụp ảnh nhanh
              </button>

              {/* Button 3: Choose file from computer */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <ImageIcon className="w-4 h-4" /> Chọn ảnh từ máy
              </button>
            </div>

            {/* Error Display with Helpful Advice */}
            {cameraError && (
              <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Thông báo Camera:</span>
                </div>
                <p className="leading-relaxed">{cameraError}</p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="underline font-bold hover:text-rose-900"
                  >
                    → Chụp ảnh qua ứng dụng máy ảnh thiết bị
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="underline font-bold hover:text-rose-900"
                  >
                    → Chọn ảnh từ thư viện
                  </button>
                </div>
              </div>
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
