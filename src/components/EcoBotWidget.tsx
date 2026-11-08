'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEcoStore } from '@/lib/store';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Trash2,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export default function EcoBotWidget() {
  const { chatMessages, sendChatMessage, clearChat } = useEcoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput('');
    setLoading(true);
    await sendChatMessage(text);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-forest-800 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-2.5 border-2 border-white/40"
          title="Trò chuyện với EcoBot AI"
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
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                </h4>
                <p className="text-[10px] text-emerald-200">Trợ lý cố vấn sinh thái 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <Link
                href="/chatbot"
                onClick={() => setIsOpen(false)}
                title="Mở toàn màn hình"
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
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 px-1 mt-0.5">
                  {msg.timestamp}
                </span>

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
              <div className="flex items-center gap-2 text-xs text-emerald-700 p-2 bg-emerald-50 rounded-xl max-w-[70%] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>EcoBot đang suy nghĩ giải đáp...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200/90 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi về cách phân loại, tái chế, compost..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
