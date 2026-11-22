'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEcoStore } from '@/lib/store';
import FormattedChatMessage from '@/components/ChatMessageFormatter';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Trash2,
  RotateCcw,
  MessageSquare,
  ExternalLink,
  Image as ImageIcon,
  Key,
} from 'lucide-react';
import Link from 'next/link';

export default function EcoBotWidget() {
  const { chatMessages, sendChatMessage, clearChat, geminiApiKey, openaiApiKey, chatModel, aiProvider } = useEcoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

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

  const getProviderBadge = () => {
    if (aiProvider === 'gemini' && geminiApiKey) return 'Gemini Vision';
    if (aiProvider === 'chatgpt' && openaiApiKey) return 'ChatGPT';
    if (geminiApiKey) return 'Gemini Vision';
    if (openaiApiKey) return 'ChatGPT';
    return 'EcoBot Free';
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-forest-800 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-2.5 border-2 border-white/40"
          title="Trò chuyện với EcoBot AI (Gemini Vision / ChatGPT)"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">
            Hỏi EcoBot AI
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[540px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-forest-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  EcoBot AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-emerald-100 font-semibold">
                    {getProviderBadge()}
                  </span>
                </h4>
                <p className="text-[10px] text-emerald-200">Trợ lý phân loại, tái chế & Vision 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <Link
                href="/chatbot"
                onClick={() => setIsOpen(false)}
                title="Cấu hình Gemini Vision & Mở toàn màn hình"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={clearChat}
                title="Xóa đoạn chat"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  {msg.imageAttachment && (
                    <img
                      src={msg.imageAttachment}
                      alt="Ảnh đã gửi"
                      className="max-w-[200px] max-h-[140px] object-cover rounded-xl border border-white/20 mb-2 shadow-xs"
                    />
                  )}
                  <FormattedChatMessage content={msg.text} isUser={msg.sender === 'user'} />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 px-1 mt-0.5 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <a
                      href={msg.chatGptWebUrl || `https://chatgpt.com/?q=${encodeURIComponent(msg.text.slice(0, 300))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.2 rounded border border-teal-200 transition-colors"
                      title="Mở trên ChatGPT.com"
                    >
                      <span>chatgpt.com</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Suggestions pill */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-colors text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 p-2 bg-emerald-50 rounded-xl max-w-[70%] animate-pulse border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {aiProvider === 'gemini' && geminiApiKey
                    ? 'Gemini Vision đang phân tích...'
                    : 'EcoBot đang suy nghĩ giải đáp...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached image preview */}
          {selectedImage && (
            <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={selectedImage}
                  alt="Ảnh đã chọn"
                  className="w-8 h-8 object-cover rounded-lg border border-emerald-300"
                />
                <span className="text-[11px] font-semibold text-emerald-900">
                  Đã đính kèm ảnh
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-rose-600 hover:bg-rose-100 p-1 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 border-t border-slate-200/90 bg-white flex items-center gap-1.5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 shrink-0"
              title="Đính kèm ảnh để Gemini Vision xem"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              placeholder={selectedImage ? 'Nhập câu hỏi kèm ảnh...' : 'Hỏi về rác, cách phân loại, tái chế...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || loading}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
