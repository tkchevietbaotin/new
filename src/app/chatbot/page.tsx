'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEcoStore } from '@/lib/store';
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
} from 'lucide-react';

export default function ChatbotPage() {
  const { chatMessages, sendChatMessage, clearChat } = useEcoStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const TOPIC_PRESETS = [
    {
      icon: Recycle,
      title: 'Phân loại Nhựa #1 - #7',
      prompt: 'Giải thích chi tiết sự khác biệt giữa nhựa PET #1, HDPE #2, PVC #3 và PP #5. Loại nào tái chế được tại Việt Nam?',
    },
    {
      icon: ShieldAlert,
      title: 'Xử lý Pin Cũ & Rác Điện Tử',
      prompt: 'Pin tiểu AA và pin sạc dự phòng cũ nếu vứt bừa bãi sẽ gây hại ra sao? Tôi có thể mang pin đến đâu để tiêu hủy an toàn?',
    },
    {
      icon: Leaf,
      title: 'Ủ Phân Hữu Cơ Tại Ban Công',
      prompt: 'Hướng dẫn các bước ủ rác nhà bếp (vỏ rau củ quả, bã cà phê) thành phân compost tại căn hộ chung cư không mùi hôi?',
    },
    {
      icon: Lightbulb,
      title: 'Mẹo Sống Zero-Waste Dễ Làm',
      prompt: 'Gợi ý 5 thói quen đơn giản để giảm 80% rác thải nhựa dùng một lần khi đi chợ và mua sắm hàng ngày?',
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Trợ Lý Cố Vấn Sinh Thái Thông Minh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            EcoBot AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chuyên gia giải đáp về phân loại rác, quy tắc 5R, công nghệ tái chế và giải pháp sống bền vững.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Làm mới hội thoại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Preset Topics */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Chủ đề gợi ý phổ biến:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {TOPIC_PRESETS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="p-3.5 rounded-2xl glass-card border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group space-y-1"
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
                <div className="flex items-start gap-2.5 max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 shadow-xs whitespace-pre-line leading-relaxed text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none ml-auto'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 px-10 mt-1">
                  {msg.timestamp}
                </span>

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
                <span>EcoBot đang phân tích kiến thức sinh thái...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn (ví dụ: Vỏ chai tương ớt có tái chế được không?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
