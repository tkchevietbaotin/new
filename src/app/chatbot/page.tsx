'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEcoStore } from '@/lib/store';
import FormattedChatMessage from '@/components/ChatMessageFormatter';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  HelpCircle,
  Leaf,
  Layers,
  Recycle,
  Lightbulb,
  ShieldAlert,
  Key,
  CheckCircle2,
  Settings,
  Cpu,
  X,
  Zap,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  UploadCloud,
  Check,
} from 'lucide-react';

export default function ChatbotPage() {
  const {
    chatMessages,
    sendChatMessage,
    clearChat,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    chatModel,
    setChatModel,
    aiProvider,
    setAiProvider,
  } = useEcoStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Modal Settings State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'gemini' | 'openai'>('gemini');
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiApiKey || '');
  const [tempOpenaiKey, setTempOpenaiKey] = useState(openaiApiKey || '');
  const [tempModel, setTempModel] = useState(chatModel || 'gemini-1.5-flash');
  const [tempProvider, setTempProvider] = useState<'gemini' | 'chatgpt' | 'ecobot'>(aiProvider || 'gemini');
  const [keySavedNotification, setKeySavedNotification] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const TOPIC_PRESETS = [
    {
      icon: Recycle,
      title: '5 Bước: Chai Nhựa PET #1',
      prompt: 'Tôi có 1 chai nhựa nước khoáng PET #1: Đó là rác gì, loại chất thải nào, cần làm gì với nó, có tái chế được không và tái chế thành những gì?',
    },
    {
      icon: ShieldAlert,
      title: '5 Bước: Xử Lý Pin Cũ',
      prompt: 'Pin tiểu AA đã dùng hết: Đó là rác gì, thuộc loại chất thải nào, cần làm gì với nó, có thể tái chế được không và tái chế được những gì?',
    },
    {
      icon: Leaf,
      title: '5 Bước: Quần Áo & Vải Cũ',
      prompt: 'Tôi có vài chiếc áo thun cotton và quần jeans cũ: Đó là rác gì, thuộc loại chất thải nào, cần làm gì với nó, có tái chế được không và tái chế được những gì?',
    },
    {
      icon: Lightbulb,
      title: '5 Bước: Bìa Carton Đóng Hàng',
      prompt: 'Hộp bìa carton sóng sau khi nhận hàng online: Đó là rác gì, chất thải loại gì, cần làm gì với nó, có thể tái chế được không và tái chế được những gì?',
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if ((!text.trim() && !selectedImage) || loading) return;

    const imgToSend = selectedImage;
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    await sendChatMessage(
      text.trim() || 'Hãy phân tích hình ảnh này và cho biết 5 thông tin cốt lõi về phân loại & tái chế rác.',
      undefined,
      imgToSend || undefined
    );
    setLoading(false);
  };

  const handleOpenSettings = () => {
    setTempGeminiKey(geminiApiKey || '');
    setTempOpenaiKey(openaiApiKey || '');
    setTempModel(chatModel || 'gemini-1.5-flash');
    setTempProvider(aiProvider || 'gemini');
    setShowKeyModal(true);
  };

  const handleSaveSettings = () => {
    setGeminiApiKey(tempGeminiKey.trim());
    setOpenaiApiKey(tempOpenaiKey.trim());
    setChatModel(tempModel);
    setAiProvider(tempProvider);
    setKeySavedNotification(true);
    setTimeout(() => {
      setKeySavedNotification(false);
      setShowKeyModal(false);
    }, 900);
  };

  // Determine current active AI display label
  const getActiveAiLabel = () => {
    if (aiProvider === 'gemini' && geminiApiKey) {
      return `Gemini Vision (${chatModel})`;
    }
    if (aiProvider === 'chatgpt' && openaiApiKey) {
      return `ChatGPT (${chatModel})`;
    }
    if (geminiApiKey) {
      return `Gemini Vision (${chatModel})`;
    }
    if (openaiApiKey) {
      return `ChatGPT (${chatModel})`;
    }
    return 'EcoBot AI Free';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 text-xs font-bold mb-2 border border-teal-200/60">
            <Bot className="w-3.5 h-3.5 text-teal-700" />
            <span>Tích hợp Google Gemini Vision & ChatGPT Cố Vấn Môi Trường</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>EcoBot AI Assistant</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {getActiveAiLabel()}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hỏi đáp văn bản & Gửi ảnh trực tiếp để Gemini Vision phân tích 10 nhóm rác thải, quy chuẩn Luật BVMT và giải đáp 5 thông tin cốt lõi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Key Settings Button */}
          <button
            onClick={handleOpenSettings}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            title="Cấu hình Google Gemini Vision & OpenAI Key"
          >
            <Key className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {geminiApiKey || openaiApiKey ? 'Cài đặt Gemini / ChatGPT' : 'Cấu hình Gemini Vision'}
            </span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={clearChat}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Preset Topics & System Info */}
        <div className="space-y-3 lg:col-span-1">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Chuẩn 5 Thông Tin Cốt Lõi:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dù hỏi bằng câu hỏi văn bản hay gửi ảnh vật thể cho <b>Gemini Vision</b>, AI luôn giải đáp chuẩn 5 mục:
            </p>
            <ol className="text-[11px] text-slate-700 space-y-1 font-medium list-decimal list-inside pl-1">
              <li><b>Đó là rác thải gì</b> (Tên & cấu tạo)</li>
              <li><b>Chất thải loại gì</b> (Màu thùng BVMT)</li>
              <li><b>Cần làm gì với nó</b> (Quy trình xử lý)</li>
              <li><b>Có thể tái chế không</b> (Tỷ lệ %)</li>
              <li><b>Tái chế được những gì?</b> (Sản phẩm tái sinh)</li>
            </ol>
          </div>

          {/* Gemini Vision Capability Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-teal-200/80 shadow-2xs space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Hỗ trợ Gemini Vision</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Bạn có thể bấm nút <b>Ảnh / Camera</b> bên dưới khung chat để đính kèm hình ảnh vật phẩm thực tế ngoài đời!
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pt-1">
            Câu hỏi mẫu phổ biến:
          </span>

          <div className="space-y-2">
            {TOPIC_PRESETS.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(topic.prompt)}
                  className="w-full text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group flex items-start gap-2.5 shadow-2xs"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      {topic.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {topic.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Stream */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 flex flex-col h-[650px] shadow-sm overflow-hidden">
          {/* Chat Stream Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? 'Bạn' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 shadow-xs leading-relaxed text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none ml-auto'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {/* Attached Image display */}
                    {msg.imageAttachment && (
                      <div className="mb-2.5">
                        <img
                          src={msg.imageAttachment}
                          alt="Ảnh đính kèm"
                          className="max-w-[240px] max-h-[180px] object-cover rounded-xl border border-white/20 shadow-sm"
                        />
                        <span className="text-[10px] opacity-80 mt-1 block">
                          📷 Ảnh gửi cho AI Vision phân tích
                        </span>
                      </div>
                    )}

                    <FormattedChatMessage content={msg.text} isUser={msg.sender === 'user'} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 px-10 mt-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                        {msg.aiProvider === 'gemini'
                          ? `Google Gemini Vision (${msg.model || '1.5-flash'})`
                          : msg.aiProvider === 'chatgpt'
                          ? `ChatGPT (${msg.model || 'OpenAI'})`
                          : msg.model || 'EcoBot Grounded (12k Archive)'}
                      </span>
                      <a
                        href={msg.chatGptWebUrl || `https://chatgpt.com/?q=${encodeURIComponent(msg.text.slice(0, 300))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-colors"
                        title="Mở câu hỏi này trực tiếp trên ChatGPT.com"
                      >
                        <span>Mở trên ChatGPT.com</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </>
                  )}
                </div>

                {/* Quick suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5 pl-10">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 p-3 bg-emerald-50 rounded-2xl max-w-sm animate-pulse ml-10 border border-emerald-200">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {aiProvider === 'gemini' && geminiApiKey
                    ? 'Google Gemini Vision đang phân tích hình ảnh & văn bản...'
                    : openaiApiKey
                    ? 'ChatGPT đang phân tích và trả lời...'
                    : 'EcoBot AI đang đối chiếu kho 12.259 mẫu dataset...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image preview before sending */}
          {selectedImage && (
            <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedImage}
                  alt="Ảnh đã chọn"
                  className="w-12 h-12 object-cover rounded-lg border border-emerald-300 shadow-2xs"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 block">Đã đính kèm ảnh vật thể</span>
                  <span className="text-[11px] text-emerald-700">Sẵn sàng để Gemini Vision phân tích</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                title="Hủy ảnh đính kèm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Attach Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 rounded-2xl bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-colors flex items-center justify-center shrink-0"
              title="Đính kèm hình ảnh vật phẩm để Gemini Vision xem"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedImage
                  ? 'Nhập câu hỏi kèm theo ảnh (hoặc bấm gửi để AI nhận diện ngay)...'
                  : 'Hỏi về rác thải: Đó là rác gì, loại gì, xử lý thế nào, tái chế được gì...'
              }
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Gemini Vision & ChatGPT API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cấu Hình AI Engine & API Key
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tích hợp Google Gemini Vision & OpenAI ChatGPT
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('gemini');
                  setTempProvider('gemini');
                  if (!tempModel.startsWith('gemini')) setTempModel('gemini-1.5-flash');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'gemini'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Google Gemini Vision</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('openai');
                  setTempProvider('chatgpt');
                  if (!tempModel.startsWith('gpt')) setTempModel('gpt-4o-mini');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'openai'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>OpenAI ChatGPT</span>
              </button>
            </div>

            {/* Tab 1: Gemini Vision */}
            {activeTab === 'gemini' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Google Gemini API Key (AIzaSy...)
                    </label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Lấy key miễn phí</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={tempGeminiKey}
                    onChange={(e) => setTempGeminiKey(e.target.value)}
                    placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Hỗ trợ quét và phân tích đa phương thức (hình ảnh chụp trực tiếp + câu hỏi chi tiết).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mô hình Gemini Vision
                  </label>
                  <select
                    value={tempModel.startsWith('gemini') ? tempModel : 'gemini-1.5-flash'}
                    onChange={(e) => setTempModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Khuyên dùng - Nhanh, Siêu nhạy, Xử lý ảnh Vision)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mạnh nhất - Phân tích chi tiết chuyên sâu)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Thế hệ mới nhất)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab 2: OpenAI ChatGPT */}
            {activeTab === 'openai' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      OpenAI API Key (sk-...)
                    </label>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Lấy key OpenAI</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={tempOpenaiKey}
                    onChange={(e) => setTempOpenaiKey(e.target.value)}
                    placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Key được lưu an toàn trực tiếp trên LocalStorage trình duyệt của bạn.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mô hình ChatGPT
                  </label>
                  <select
                    value={tempModel.startsWith('gpt') ? tempModel : 'gpt-4o-mini'}
                    onChange={(e) => setTempModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="gpt-4o-mini">GPT-4o-mini (Khuyên dùng - Nhanh, chuẩn xác, tiết kiệm)</option>
                    <option value="gpt-4o">GPT-4o (Mạnh nhất - Đầy đủ chi tiết)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5-turbo (Cơ bản)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">💡 Chế độ miễn phí không cần Key:</span>
              <span>
                Nếu không cấu hình API Key, hệ thống tự động sử dụng **EcoBot Knowledge Base** đối chiếu với 12.259 mẫu thực tế từ kho archive hoàn toàn miễn phí!
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setTempGeminiKey('');
                  setTempOpenaiKey('');
                  setGeminiApiKey('');
                  setOpenaiApiKey('');
                  setAiProvider('ecobot');
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Xóa Key & Dùng Free
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                {keySavedNotification ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Đã lưu thành công!</span>
                  </>
                ) : (
                  <span>Lưu Cấu Hình</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
