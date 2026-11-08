'use client';

import React, { useState } from 'react';
import { useEcoStore } from '@/lib/store';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Battery,
  Recycle,
  Sparkles,
  Phone,
  Clock,
  Compass,
  CheckCircle2,
  X,
  Navigation,
  Layers,
} from 'lucide-react';
import { EcoLocation, LocationCategory } from '@/types';

export default function EcoMapPage() {
  const { locations, addLocation, user } = useEcoStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState<EcoLocation | null>(locations[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new location
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<LocationCategory>('battery_ewaste');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Hà Nội');
  const [newMaterials, setNewMaterials] = useState('');
  const [newHours, setNewHours] = useState('08:00 - 20:00');
  const [newPhone, setNewPhone] = useState('');

  const filterCategories = [
    { id: 'all', label: 'Tất cả điểm thu gom', icon: Layers },
    { id: 'battery_ewaste', label: 'Pin & Rác Điện Tử', icon: Battery },
    { id: 'recycling_center', label: 'Trạm Phế Liệu & Tái Chế', icon: Recycle },
    { id: 'refill_station', label: 'Trạm Refill Sống Xanh', icon: Sparkles },
    { id: 'public_bin', label: 'Thùng Rác Phân Loại', icon: MapPin },
  ];

  const cities = ['all', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'];

  const filteredLocations = locations.filter((loc) => {
    const matchCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchCity = selectedCity === 'all' || loc.city === selectedCity;
    const matchSearch =
      !searchQuery.trim() ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.acceptedMaterials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchCity && matchSearch;
  });

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) return;

    addLocation({
      name: newName.trim(),
      category: newCategory,
      categoryNameVi:
        filterCategories.find((c) => c.id === newCategory)?.label || 'Điểm thu gom',
      address: newAddress.trim(),
      city: newCity,
      distanceKm: +(0.5 + Math.random() * 3).toFixed(1),
      coordinates: { lat: 21.0285, lng: 105.8542 },
      acceptedMaterials: newMaterials.split(',').map((s) => s.trim()).filter(Boolean),
      openingHours: newHours,
      phone: newPhone || '1900 1234',
      verified: false,
      rewardPointsBonus: 40,
    });

    setShowAddModal(false);
    setNewName('');
    setNewAddress('');
    setNewMaterials('');
  };

  const getCategoryBadge = (cat: LocationCategory) => {
    switch (cat) {
      case 'battery_ewaste':
        return { label: 'Pin & Rác Điện Tử', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'recycling_center':
        return { label: 'Trạm Phế Liệu', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'refill_station':
        return { label: 'Trạm Refill Xanh', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      default:
        return { label: 'Thùng Rác Thông Minh', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mạng Lưới Điểm Xanh Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Bản Đồ Số Điểm Thu Gom & Refill
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tra cứu các điểm bỏ pin cũ an toàn, trạm thu mua phế liệu, điểm đổ đầy (refill) và thùng rác phân loại gần bạn nhất.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Đề xuất điểm xanh mới (+50 GP)</span>
        </button>
      </div>

      {/* Search & City Filter Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên điểm, loại rác (pin, lon, giấy, chai lọ...) hoặc tên đường..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* City Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city === 'all' ? 'Toàn quốc' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer & Location List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Canvas Visualization */}
        <div className="lg:col-span-7 glass-card rounded-3xl overflow-hidden border border-emerald-100 shadow-md relative h-[480px] sm:h-[600px] flex flex-col">
          {/* Simulated Interactive Map View with Grid, Waterway, Road Network and Pins */}
          <div className="relative w-full h-full bg-[#e8ede8] overflow-hidden select-none">
            {/* SVG Map Canvas Grid */}
            <svg className="w-full h-full absolute inset-0 opacity-40">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Simulated River / Waterway */}
              <path
                d="M -20,250 Q 150,180 300,280 T 600,220 T 900,320"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="28"
                strokeLinecap="round"
              />
              {/* Simulated Major Roads */}
              <path
                d="M 50,0 Q 200,300 350,600"
                fill="none"
                stroke="#fde68a"
                strokeWidth="10"
              />
              <path
                d="M 0,380 L 800,340"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="8"
              />
            </svg>

            {/* Map Top Status Pill */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Hiển thị {filteredLocations.length} điểm thu gom tại {selectedCity === 'all' ? 'Việt Nam' : selectedCity}
              </span>
            </div>

            {/* Simulated Interactive Location Pins */}
            {filteredLocations.map((loc, idx) => {
              const isSelected = activeLocation?.id === loc.id;
              // Preset relative visual positions for display
              const positions = [
                { top: '35%', left: '42%' },
                { top: '55%', left: '60%' },
                { top: '25%', left: '70%' },
                { top: '65%', left: '30%' },
                { top: '45%', left: '20%' },
                { top: '75%', left: '75%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                >
                  <div
                    className={`p-2.5 rounded-2xl shadow-lg transition-all transform hover:scale-125 flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/80 scale-110'
                        : loc.category === 'battery_ewaste'
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : loc.category === 'refill_station'
                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {loc.category === 'battery_ewaste' ? (
                      <Battery className="w-4 h-4" />
                    ) : loc.category === 'refill_station' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Recycle className="w-4 h-4" />
                    )}
                  </div>

                  {/* Tooltip on Hover or Select */}
                  {(isSelected || idx === 0) && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-900 text-white p-2 rounded-xl text-[11px] shadow-xl text-center pointer-events-none animate-in fade-in duration-150">
                      <p className="font-bold truncate">{loc.name}</p>
                      <p className="text-emerald-400 font-medium">Cách bạn ~{loc.distanceKm} km</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Selected Location Card Overlay at Bottom of Map */}
            {activeLocation && (
              <div className="absolute bottom-4 inset-x-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl space-y-2 animate-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        getCategoryBadge(activeLocation.category).color
                      }`}
                    >
                      {activeLocation.categoryNameVi}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">
                      {activeLocation.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{activeLocation.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>+{activeLocation.rewardPointsBonus} GP</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {activeLocation.openingHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {activeLocation.phone}
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeLocation.name + ' ' + activeLocation.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Navigation className="w-3 h-3" /> Chỉ đường Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scrollable List of Locations */}
        <div className="lg:col-span-5 space-y-3 h-[480px] sm:h-[600px] overflow-y-auto pr-1">
          {filteredLocations.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Không tìm thấy điểm thu gom phù hợp.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setSearchQuery('');
                }}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Xem tất cả điểm
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              const badge = getCategoryBadge(loc.category);
              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/30'
                      : 'border-slate-200/90 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                        {loc.name}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg border border-slate-200 flex-shrink-0">
                      ~{loc.distanceKm} km
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-snug">
                    {loc.address}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {loc.acceptedMaterials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        ✓ {mat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add New Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Đề xuất điểm xanh mới</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLocationSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên điểm thu gom / Cửa hàng:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cửa hàng VinMart+ số 25 Kim Mã"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LocationCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="battery_ewaste">Pin & Rác Điện Tử</option>
                    <option value="recycling_center">Trạm Phế Liệu & Tái Chế</option>
                    <option value="refill_station">Trạm Refill Sống Xanh</option>
                    <option value="public_bin">Thùng Rác Phân Loại</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thành phố:</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ chi tiết:</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Vật liệu tiếp nhận (phân cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="Pin cũ, Vỏ lon nhôm, Bìa carton, Đồ điện gia dụng..."
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  Gửi đề xuất (+50 GP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
