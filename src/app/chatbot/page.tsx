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
} from 'lucide-react';

export default function ChatbotPage() {
  const {
    chatMessages,
    sendChatMessage,
    clearChat,
    openaiApiKey,
    setOpenaiApiKey,
    chatModel,
    setChatModel,
  } = useEcoStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(openaiApiKey || '');
  const [tempModel, setTempModel] = useState(chatModel || 'gpt-4o-mini');
  const [keySavedNotification, setKeySavedNotification] = useState(false);
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

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput('');
    setLoading(true);
    await sendChatMessage(text);
    setLoading(false);
  };

  const handleSaveSettings = () => {
    setOpenaiApiKey(tempKey.trim());
    setChatModel(tempModel);
    setKeySavedNotification(true);
    setTimeout(() => {
      setKeySavedNotification(false);
      setShowKeyModal(false);
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tích hợp ChatGPT & Cố Vấn Sinh Thái Thông Minh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>EcoBot AI Assistant</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200">
              {openaiApiKey ? `ChatGPT (${chatModel})` : 'EcoBot AI Free'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giải đáp tức thì về phân loại 10 nhóm rác thải, quy chuẩn Luật BVMT, khả năng tái chế và hướng dẫn xử lý từng bước.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Key Settings Button */}
          <button
            onClick={() => {
              setTempKey(openaiApiKey || '');
              setTempModel(chatModel || 'gpt-4o-mini');
              setShowKeyModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            title="Cài đặt OpenAI ChatGPT API Key"
          >
            <Key className="w-3.5 h-3.5 text-teal-600" />
            <span>{openaiApiKey ? 'Cài đặt ChatGPT' : 'Nhập Key ChatGPT'}</span>
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
        {/* Left Column: Preset Topics */}
        <div className="space-y-3 lg:col-span-1">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-transparent border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Chuẩn 5 Thông Tin:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mỗi khi hỏi về bất kỳ vật phẩm hay loại rác nào, AI sẽ giải đáp đầy đủ 5 mục cốt lõi:
            </p>
            <ol className="text-[11px] text-slate-700 space-y-1 font-medium list-decimal list-inside pl-1">
              <li>Đó là rác thải gì</li>
              <li>Chất thải loại gì</li>
              <li>Cần làm gì với nó</li>
              <li>Có thể tái chế không</li>
              <li>Tái chế được những gì?</li>
            </ol>
          </div>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block pt-1">
            Câu hỏi mẫu phổ biến:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {TOPIC_PRESETS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="p-3.5 rounded-2xl glass-card border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group space-y-1 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-3 glass-card rounded-3xl border border-emerald-100 shadow-md flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 shadow-xs leading-relaxed text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none ml-auto'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FormattedChatMessage content={msg.text} isUser={msg.sender === 'user'} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 px-10 mt-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                        {msg.aiProvider === 'chatgpt'
                          ? `ChatGPT (${msg.model || 'OpenAI'})`
                          : msg.model || 'EcoBot Grounded'}
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
              <div className="flex items-center gap-2 text-xs text-emerald-700 p-3 bg-emerald-50 rounded-2xl max-w-sm animate-pulse ml-10">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {openaiApiKey ? 'ChatGPT đang phân tích và trả lời...' : 'EcoBot đang phân tích kiến thức sinh thái...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về bất kỳ loại rác nào: Đó là rác gì, loại gì, xử lý thế nào, tái chế được gì..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ChatGPT API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cấu hình OpenAI ChatGPT API
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kết nối trực tiếp với mô hình ngôn ngữ OpenAI
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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  OpenAI API Key (sk-...)
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-[11px] text-slate-400">
                  Key được lưu trực tiếp trên trình duyệt của bạn (Local Storage) để bảo mật.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Mô hình ChatGPT
                </label>
                <select
                  value={tempModel}
                  onChange={(e) => setTempModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="gpt-4o-mini">GPT-4o-mini (Khuyên dùng - Nhanh, chuẩn xác, tiết kiệm)</option>
                  <option value="gpt-4o">GPT-4o (Mạnh nhất - Đầy đủ chi tiết)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5-turbo (Cơ bản)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">💡 Chế độ miễn phí không cần Key:</span>
                <span>
                  Nếu không nhập API Key, hệ thống vẫn tự động kích hoạt **EcoBot Knowledge Engine** (được huấn luyện đối chiếu sẵn với 12.259 mẫu thực tế từ archive) hoàn toàn miễn phí!
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setTempKey('');
                  setOpenaiApiKey('');
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
