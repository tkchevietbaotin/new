'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import { X, Image as ImageIcon, Sparkles, Tag } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScanItem?: string;
  defaultImage?: string;
}

const POPULAR_TAGS = ['#ZeroWaste', '#TaiCheSangTao', '#SongXanh', '#EcoScanAI', '#GiamNhua'];

export default function CreatePostModal({
  isOpen,
  onClose,
  defaultScanItem,
  defaultImage,
}: CreatePostModalProps) {
  const { createPost, user } = useEcoStore();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultImage || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#EcoScanAI', '#SongXanh']);
  const [scanItem, setScanItem] = useState(defaultScanItem || '');

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost(content, imageUrl || undefined, scanItem || undefined, selectedTags);
    setContent('');
    setImageUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Chia sẻ mẹo sống xanh</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-emerald-600 font-medium">Nhận +30 Green Points khi đăng bài</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={4}
            placeholder="Bạn vừa tái chế được gì? Hãy chia sẻ cách làm, kinh nghiệm hoặc cảm nghĩ của bạn với cộng đồng..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            required
          />

          {/* Attached Scan Item if any */}
          {scanItem && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-emerald-800 font-semibold truncate">
                Đính kèm vật phẩm quét: <strong>{scanItem}</strong>
              </span>
              <button
                type="button"
                onClick={() => setScanItem('')}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Optional Image URL */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              Link ảnh minh họa (tùy chọn):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Suggested Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Gắn thẻ chủ đề:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              Đăng lên Eco Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
