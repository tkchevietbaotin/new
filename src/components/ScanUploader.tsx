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
  Video,
  VideoOff,
  CheckCircle2,
  X,
  Play,
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
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<{ title: string; message: string; code?: string } | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isSimulatedStream, setIsSimulatedStream] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo AI Engine...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const simulatedTimerRef = useRef<any>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (simulatedTimerRef.current) {
      clearInterval(simulatedTimerRef.current);
      simulatedTimerRef.current = null;
    }
    setCameraActive(false);
    setIsSimulatedStream(false);
    setCameraLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (simulatedTimerRef.current) {
        clearInterval(simulatedTimerRef.current);
      }
    };
  }, []);

  // Check available camera devices
  const checkAvailableCameras = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setAvailableDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      }
    } catch (e) {
      console.warn('Enumerate devices notice:', e);
    }
  };

  // Attach stream to video element when element is ready
  const attachStreamToVideo = (element: HTMLVideoElement, stream: MediaStream) => {
    element.srcObject = stream;
    element.muted = true;
    element.setAttribute('playsinline', 'true');
    element.setAttribute('autoplay', 'true');

    element.onloadedmetadata = () => {
      element
        .play()
        .then(() => setCameraLoading(false))
        .catch((err) => {
          console.warn('Video play() issue:', err);
          setCameraLoading(false);
        });
    };
  };

  // Callback Ref for the video element
  const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      attachStreamToVideo(element, streamRef.current);
    }
  }, []);

  // Core function to start camera
  const startCamera = async (deviceIdToUse?: string) => {
    setCameraLoading(true);
    setCameraError(null);
    setIsSimulatedStream(false);

    // Check secure context
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCameraError({
        title: 'Môi trường không an toàn (Yêu cầu HTTPS hoặc localhost)',
        message: 'Trình duyệt chỉ cho phép truy cập Camera qua HTTPS hoặc địa chỉ http://localhost:3000. Bạn đang truy cập qua IP mạng, vui lòng mở lại bằng http://localhost:3000 trên trình duyệt.',
        code: 'INSECURE_CONTEXT',
      });
      setCameraLoading(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError({
        title: 'Trình duyệt không hỗ trợ WebRTC',
        message: 'Trình duyệt này không hỗ trợ API getUserMedia. Vui lòng sử dụng Chrome, Safari hoặc Edge mới nhất.',
        code: 'NO_MEDIA_DEVICES',
      });
      setCameraLoading(false);
      return;
    }

    // Stop existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    let stream: MediaStream | null = null;
    const targetDeviceId = deviceIdToUse || selectedDeviceId;

    try {
      // 1. Try with deviceId if specified
      if (targetDeviceId) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: targetDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } else {
        // 2. Try default flexible video constraint for desktop/laptop
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      }
    } catch (err1: any) {
      console.warn('First getUserMedia attempt failed, falling back to minimal video:true constraint...', err1);
      try {
        // 3. Fallback to basic video: true (universal across all webcams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err2: any) {
        console.error('All camera attempts failed:', err2);
        setCameraLoading(false);

        const errorName = err2.name || err1.name || 'Lỗi không xác định';
        let title = 'Không thể mở Camera';
        let message = err2.message || '';

        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          title = 'Quyền truy cập Camera bị từ chối';
          message = 'Trình duyệt hoặc hệ điều hành macOS chưa được cấp quyền dùng camera. Vui lòng nhấp vào biểu tượng 🔒 hoặc 📹 trên thanh địa chỉ của trình duyệt, chọn "Cho phép" (Allow) camera, hoặc kiểm tra: Cài đặt hệ thống Mac → Quyền riêng tư & Bảo mật → Camera → Bật cho trình duyệt của bạn.';
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          title = 'Không tìm thấy thiết bị Camera';
          message = 'Máy tính chưa kết nối webcam hoặc camera đang bị ngắt kết nối. Bạn có thể dùng chế độ "Mô phỏng Camera AI" hoặc tải ảnh lên.';
        } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
          title = 'Camera đang bị ứng dụng khác chiếm dụng';
          message = 'Một ứng dụng khác (Zoom, Google Meet, FaceTime, Photo Booth...) đang sử dụng camera của bạn. Vui lòng tắt các ứng dụng đó hoặc dùng chế độ "Mô phỏng Camera AI".';
        } else {
          message = `Mã lỗi: ${errorName} - ${message || 'Vui lòng kiểm tra lại thiết bị hoặc quyền riêng tư của trình duyệt.'}`;
        }

        setCameraError({ title, message, code: errorName });
        return;
      }
    }

    if (stream) {
      streamRef.current = stream;
      setCameraActive(true);
      setCameraLoading(false);

      // Refresh list of devices to display labels (labels are available only after permission granted)
      checkAvailableCameras();

      // If video element is already mounted, attach stream
      if (videoRef.current) {
        attachStreamToVideo(videoRef.current, stream);
      }
    }
  };

  // Start Simulated Live Camera (Zero-error fallback for computers without camera or with permissions blocked)
  const startSimulatedCamera = () => {
    stopCamera();
    setCameraError(null);
    setCameraActive(true);
    setIsSimulatedStream(true);
    setCameraLoading(false);
  };

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

  const capturePhoto = () => {
    if (isSimulatedStream) {
      // Capture from simulated canvas / image
      stopCamera();
      // Select sample 1 as simulated capture
      const sample = PRESET_SAMPLES[0];
      startAnalysis(sample.url, 'camera_capture_simulated.jpg');
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        stopCamera();
        startAnalysis(dataUrl, 'camera_snapshot.jpg');
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
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera View (Physical or Simulated) */}
        {cameraActive ? (
          <div className="relative max-w-lg mx-auto overflow-hidden rounded-3xl bg-slate-950 shadow-2xl border-4 border-emerald-500/60 animate-in fade-in zoom-in-95 duration-200">
            {isSimulatedStream ? (
              /* Simulated Motion Camera Feed */
              <div className="relative w-full h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80"
                  alt="Simulated Camera Stream"
                  className="w-full h-full object-cover opacity-85 scale-105"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Chế độ Camera Mô Phỏng Sẵn Sàng</span>
                </div>
              </div>
            ) : (
              /* Physical Webcam Stream */
              <div className="relative w-full h-72 sm:h-80 bg-black flex items-center justify-center">
                <video
                  ref={setVideoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {cameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                    <span className="text-xs font-semibold">Đang kích hoạt ống kính Camera...</span>
                  </div>
                )}
              </div>
            )}

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-emerald-400 rounded-3xl border-dashed animate-pulse flex flex-col items-center justify-between p-3">
                <span className="text-[10px] text-white bg-black/70 px-2.5 py-0.5 rounded-full font-bold backdrop-blur-md shadow-sm">
                  Căn giữa vật phẩm vào khung
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  AI Optical Tracker Active
                </span>
              </div>
            </div>

            {/* Top Toolbar: Device Selector & Close */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 gap-2">
              {availableDevices.length > 1 && !isSimulatedStream ? (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    startCamera(e.target.value);
                  }}
                  className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-white/20 focus:outline-none max-w-[200px] truncate"
                >
                  {availableDevices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId} className="bg-slate-900 text-white">
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold transition-all border border-white/20"
              >
                Đóng
              </button>
            </div>

            {/* Bottom Toolbar: Capture Photo */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 z-10">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-7 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-2xl shadow-emerald-500/50 flex items-center gap-2.5 transition-all transform active:scale-95"
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
                onClick={() => startCamera()}
                disabled={cameraLoading}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {cameraLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Camera className="w-4 h-4 text-emerald-400" />
                )}
                <span>Bật Camera trực tiếp</span>
              </button>

              {/* Button 2: Choose file from computer */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <ImageIcon className="w-4 h-4" /> Chọn ảnh từ máy
              </button>
            </div>

            {/* Error Display with Smart Actionable Fixes */}
            {cameraError && (
              <div className="max-w-lg mx-auto p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left space-y-2 animate-in fade-in duration-150 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{cameraError.title}</span>
                  </div>
                  <button
                    onClick={() => setCameraError(null)}
                    className="p-1 rounded-full text-rose-400 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="leading-relaxed text-slate-700 text-xs">{cameraError.message}</p>

                {/* Instant Solutions */}
                <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={startSimulatedCamera}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Dùng Chế độ Camera Mô Phỏng (Test ngay)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all"
                  >
                    Tải ảnh từ máy
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-3 py-1.5 rounded-xl text-emerald-700 hover:underline font-bold text-xs flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Thử lại
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
