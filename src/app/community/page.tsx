'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';
import {
  Users,
  Plus,
  Sparkles,
  Trophy,
  Filter,
  Compass,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const {
    posts,
    user,
    users,
    marketplaceItems,
    addMarketplaceItem,
    claimMarketplaceItem,
    events,
    toggleJoinEvent,
  } = useEcoStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'marketplace' | 'events'>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Marketplace form state
  const [itemTitle, setItemTitle] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemCat, setItemCat] = useState('Chai lọ & Hộp');
  const [itemCond, setItemCond] = useState<'Mới 100%' | 'Như mới (95%)' | 'Đã qua sử dụng'>('Như mới (95%)');
  const [itemLocation, setItemLocation] = useState('Hà Nội');
  const [itemImg, setItemImg] = useState('');
  const [itemIsFree, setItemIsFree] = useState(true);

  const filterTags = [
    { id: 'all', label: 'Tất cả bài viết' },
    { id: '#ZeroWaste', label: '#ZeroWaste' },
    { id: '#TaiCheSangTao', label: '#TaiCheSangTao' },
    { id: '#DIYUpcycling', label: '#DIYUpcycling' },
    { id: '#SongXanh', label: '#SongXanh' },
  ];

  const filteredPosts =
    activeTag === 'all'
      ? posts
      : posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));

  const topUsers = [...users].sort((a, b) => b.greenPoints - a.greenPoints).slice(0, 4);

  const handleCreateMarketplace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !itemDesc.trim()) return;

    addMarketplaceItem({
      title: itemTitle.trim(),
      description: itemDesc.trim(),
      category: itemCat,
      condition: itemCond,
      location: itemLocation,
      isFree: itemIsFree,
      greenPointsPrice: itemIsFree ? undefined : 50,
      imageUrl: itemImg || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
    });

    setShowAddItemModal(false);
    setItemTitle('');
    setItemDesc('');
    setItemImg('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Mạng Lưới Sống Xanh Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trung Tâm Cộng Đồng Sinh Thái
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giao lưu trên Eco Feed, trao đổi đồ cũ 0 đồng tại Chợ Xanh và tham gia các chiến dịch môi trường.
          </p>
        </div>

        {/* Action Button depending on tab */}
        {activeTab === 'feed' ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng bài viết mới (+30 GP)</span>
          </button>
        ) : activeTab === 'marketplace' ? (
          <button
            type="button"
            onClick={() => setShowAddItemModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tặng / Cho đồ cũ (+40 GP)</span>
          </button>
        ) : null}
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Eco Feed ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Chợ Xanh 0 Đồng ({marketplaceItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Sự Kiện Xanh ({events.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Eco Feed */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Post Prompt Box */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="glass-card rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-3.5"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div className="flex-1 bg-slate-100/80 hover:bg-slate-100 text-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-2xl">
                Bạn có mẹo tái chế hay vật phẩm muốn chia sẻ không?
              </div>
              <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0">
                <Plus className="w-3.5 h-3.5" />
                <span>Đăng</span>
              </button>
            </div>

            {/* Tag Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
                <Filter className="w-3.5 h-3.5" /> Lọc:
              </span>
              {filterTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(tag.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTag === tag.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl glass-card border border-slate-200 text-slate-400 space-y-3">
                  <Compass className="w-10 h-10 mx-auto text-emerald-500 animate-spin" />
                  <p className="text-sm font-semibold">Chưa có bài viết nào trong chủ đề này.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Hãy là người đầu tiên đăng bài!
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Top Sứ Giả Xanh Tuần</span>
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-xs text-emerald-600 hover:underline font-semibold"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3">
                {topUsers.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 text-center font-bold ${
                          i === 0
                            ? 'text-amber-500'
                            : i === 1
                            ? 'text-slate-500'
                            : i === 2
                            ? 'text-amber-700'
                            : 'text-slate-400'
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[110px]">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.rankTitle}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-700">{u.greenPoints} GP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chợ Xanh 0 Đồng (Marketplace) */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Chợ Xanh 0 Đồng & Trao Đổi Đồ Cũ (Eco Exchange)
                </h3>
                <p className="text-xs text-slate-600">
                  Đừng vội vứt bỏ đồ dùng còn tốt! Hãy cho/tặng chai lọ thủy tinh, chậu cây tái chế, quần áo cũ cho người cần.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex-shrink-0 transition-all"
            >
              Đăng món đồ muốn cho/tặng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {item.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-bold">
                        {item.condition}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      {item.isFree ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                          Miễn phí 0đ
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {item.greenPointsPrice} GP
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <h4 className="font-bold text-slate-800 text-base leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.owner.avatar}
                      alt={item.owner.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                      {item.owner.name}
                    </span>
                  </div>

                  {item.status === 'claimed' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold">
                      Đã có người nhận
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        claimMarketplaceItem(item.id);
                        alert(`Chúc mừng! Bạn đã đăng ký nhận món đồ "${item.title}". Hãy liên hệ với người đăng để nhận đồ nhé!`);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Đăng ký nhận
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sự Kiện Xanh (Green Events) */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{evt.rewardPoints} GP khi tham gia</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>Thời gian:</strong> {evt.time} - {evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span><strong>Địa điểm:</strong> {evt.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          <strong>Người tham gia:</strong> {evt.participantsCount} / {evt.maxParticipants} người
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Tổ chức bởi: <strong>{evt.organizer}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleJoinEvent(evt.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      evt.isJoined
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'
                    }`}
                  >
                    {evt.isJoined ? '✓ Đã đăng ký tham gia' : 'Đăng ký tham gia ngay'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal create post */}
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Modal create marketplace item */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-teal-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Tặng đồ cũ tại Chợ Xanh</h3>
              </div>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMarketplace} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên món đồ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 10 hũ thủy tinh đựng mứt sạch, áo khoác ấm cũ..."
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Danh mục:</label>
                  <select
                    value={itemCat}
                    onChange={(e) => setItemCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Chai lọ & Hộp">Chai lọ & Hộp</option>
                    <option value="Cây cảnh & Tái chế">Cây cảnh & Tái chế</option>
                    <option value="Quần áo & Vải cũ">Quần áo & Vải cũ</option>
                    <option value="Sách & Tài liệu">Sách & Tài liệu</option>
                    <option value="Đồ điện gia dụng cũ">Đồ điện gia dụng cũ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tình trạng:</label>
                  <select
                    value={itemCond}
                    onChange={(e) => setItemCond(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Mới 100%">Mới 100%</option>
                    <option value="Như mới (95%)">Như mới (95%)</option>
                    <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Khu vực / Quận:</label>
                <input
                  type="text"
                  placeholder="Quận 1 - TP.HCM hoặc Cầu Giấy - Hà Nội..."
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả chi tiết:</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả kích cỡ, cách sử dụng hoặc cách thức nhận đồ..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Link ảnh sản phẩm (tùy chọn):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={itemImg}
                  onChange={(e) => setItemImg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30"
                >
                  Đăng lên Chợ Xanh (+40 GP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
