'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { useEcoStore } from '@/lib/store';
import {
  Heart,
  MessageCircle,
  Share2,
  Tag,
  Send,
  Sparkles,
  Award,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user, likePost, addComment } = useEcoStore();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const currentUserId = user ? user.id : 'usr-guest';
  const isLiked = post.likes.includes(currentUserId);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  return (
    <article className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
      {/* Header: Author Info */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-800">
                {post.author.name}
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Award className="w-2.5 h-2.5" /> {post.author.rankTitle}
              </span>
            </div>
            <span className="text-xs text-slate-400">{post.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Content Text */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Scan attachment tag if any */}
        {post.scanItemName && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vật phẩm đã quét: {post.scanItemName}</span>
          </div>
        )}
      </div>

      {/* Attached Image if any */}
      {post.imageUrl && (
        <div className="relative w-full max-h-96 overflow-hidden bg-slate-100">
          <img
            src={post.imageUrl}
            alt="Eco post media"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 sm:px-5 pt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactions Bar */}
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-slate-500">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            type="button"
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors ${
              isLiked ? 'text-rose-500' : 'hover:text-rose-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              } transition-transform`}
            />
            <span>{post.likes.length}</span>
            <span className="hidden sm:inline">Thích</span>
          </button>

          {/* Comment Count / Toggle */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold hover:text-emerald-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
            <span className="hidden sm:inline">Bình luận</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'EcoScan Community Post',
                text: post.content,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Đã sao chép link bài viết vào clipboard!');
            }
          }}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium hover:text-emerald-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* List of comments */}
          {post.comments.length > 0 ? (
            <div className="space-y-2.5">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-7 h-7 rounded-full object-cover mt-0.5"
                  />
                  <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{comment.author.name}</span>
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ góc nhìn xanh!
            </p>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Viết cảm nghĩ hoặc mẹo tái chế của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
