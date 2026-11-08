import {
  User,
  ScanResult,
  Post,
  Challenge,
  Badge,
  ChatMessage,
  EcoLocation,
  EcoAlert,
  MarketplaceItem,
  GreenEvent,
} from '@/types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Mầm Xanh Tân Thủ',
    description: 'Thực hiện lần quét vật phẩm sinh thái đầu tiên',
    icon: '🌱',
    unlockedAt: '2026-11-01',
    requirement: 'Quét 1 vật phẩm bất kỳ',
  },
  {
    id: 'badge-2',
    title: 'Chiến Binh Giảm Nhựa',
    description: 'Phân loại thành công 10 sản phẩm nhựa khó phân hủy',
    icon: '🛡️',
    unlockedAt: '2026-11-04',
    requirement: 'Quét và phân loại 10 chai/bao bì nhựa',
  },
  {
    id: 'badge-3',
    title: 'Bậc Thầy Tái Chế',
    description: 'Đóng góp 5 ý tưởng tái chế sáng tạo cho cộng đồng',
    icon: '♻️',
    unlockedAt: '2026-11-06',
    requirement: 'Đăng 5 bài viết mẹo DIY',
  },
  {
    id: 'badge-4',
    title: 'Hiệp Sĩ Khí Hậu',
    description: 'Tiết kiệm tương đương hơn 10kg khí CO2 phát thải',
    icon: '🌍',
    requirement: 'Tích lũy 10kg CO2 tiết kiệm',
  },
  {
    id: 'badge-5',
    title: 'Sứ Giả Sống Xanh',
    description: 'Đạt vị trí Top 5 Bảng xếp hạng tuần',
    icon: '👑',
    requirement: 'Top 5 Leaderboard tuần',
  },
];

export const CURRENT_USER: User = {
  id: 'usr-current',
  name: 'Bảo Tín',
  email: 'baotincheviet@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  greenPoints: 850,
  ecoRank: 4,
  rankTitle: 'Chiến Binh Sinh Thái (Eco Knight)',
  bio: 'Đam mê lối sống bền vững, giảm thiểu rác nhựa và tìm kiếm các giải pháp tái chế thông minh mỗi ngày! 🌱',
  badges: [INITIAL_BADGES[0], INITIAL_BADGES[1], INITIAL_BADGES[2]],
  scanCount: 28,
  co2SavedKg: 8.4,
  joinedDate: 'Tháng 10, 2026',
};

export const SAMPLE_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr-2',
    name: 'Mai Lan (Zero-Waste)',
    email: 'mailan.eco@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    greenPoints: 1420,
    ecoRank: 1,
    rankTitle: 'Đại Sứ Hành Tinh Xanh',
    bio: 'Zero-waste lifestyle | Chia sẻ mẹo tái chế quần áo cũ và ủ phân hữu cơ tại nhà.',
    badges: INITIAL_BADGES,
    scanCount: 64,
    co2SavedKg: 19.2,
    joinedDate: 'Tháng 9, 2026',
  },
  {
    id: 'usr-3',
    name: 'Hoàng Long Green',
    email: 'long.hoang@earth.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    greenPoints: 1180,
    ecoRank: 2,
    rankTitle: 'Chuyên Gia Tái Sinh',
    bio: 'Kỹ sư môi trường | Thích biến vỏ chai, đồ điện tử cũ thành vật dụng trang trí hữu ích.',
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[1], INITIAL_BADGES[3]],
    scanCount: 47,
    co2SavedKg: 14.5,
    joinedDate: 'Tháng 9, 2026',
  },
  {
    id: 'usr-4',
    name: 'Phương Linh Art',
    email: 'linh.diy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
    greenPoints: 960,
    ecoRank: 3,
    rankTitle: 'Nghệ Nhân Sinh Thái',
    bio: 'DIY upcycling: biến rác thải thành nghệ thuật.',
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[2]],
    scanCount: 39,
    co2SavedKg: 11.8,
    joinedDate: 'Tháng 10, 2026',
  },
  {
    id: 'usr-5',
    name: 'Đức Trí Eco',
    email: 'ductri@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    greenPoints: 720,
    ecoRank: 5,
    rankTitle: 'Mầm Xanh Tiên Phong',
    bio: 'Hành trình 365 ngày không dùng túi nilon một lần.',
    badges: [INITIAL_BADGES[0]],
    scanCount: 22,
    co2SavedKg: 6.7,
    joinedDate: 'Tháng 10, 2026',
  },
];

export const INITIAL_SCANS: ScanResult[] = [
  {
    id: 'scan-1',
    itemName: 'Chai nước khoáng nhựa rỗng (PET #1)',
    category: 'plastic',
    categoryNameVi: 'Rác nhựa (Plastic #1 - PET)',
    materialType: 'Polyethylene Terephthalate (PETE)',
    recyclability: 'high',
    ecoScore: 58,
    co2SavedKg: 0.08,
    decompositionTime: 'Khoảng 450 năm trong môi trường tự nhiên',
    disposalGuide: [
      'Đổ hết chất lỏng còn sót lại bên trong chai',
      'Tháo nắp nhựa (nhựa PP) và bóc màng co nilông nhãn mác',
      'Dẫm bẹp thân chai để tiết kiệm thể tích thùng rác',
      'Bỏ vào thùng rác tái chế màu vàng/xanh biển'
    ],
    upcyclingTips: [
      'Khoét lỗ làm chậu cây nhỏ treo ban công hoặc giàn ươm hạt giống',
      'Làm bình tưới nước nhỏ giọt tự động cho chậu cảnh khi đi vắng',
      'Cắt phần đáy làm hộp đựng bút hoặc khay kẹp tài liệu mini'
    ],
    confidence: 0.96,
    imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hôm nay, 08:30',
    boundingBoxes: [
      { label: 'Thân chai PET', confidence: 0.98, box: [15, 25, 50, 70], color: '#10b981' },
      { label: 'Nắp nhựa PP #5', confidence: 0.94, box: [10, 42, 16, 12], color: '#3b82f6' },
      { label: 'Nhãn màng nilông', confidence: 0.91, box: [38, 25, 50, 22], color: '#f59e0b' }
    ],
    materialBreakdowns: [
      { name: 'Nhựa thân chai PET #1', percentage: 82, recyclable: true, color: '#10b981' },
      { name: 'Nắp chai PP #5', percentage: 12, recyclable: true, color: '#3b82f6' },
      { name: 'Màng nhãn LDPE', percentage: 6, recyclable: false, color: '#f59e0b' }
    ]
  },
  {
    id: 'scan-2',
    itemName: 'Vỏ lon nước ngọt bằng nhôm',
    category: 'metal',
    categoryNameVi: 'Kim loại tái chế (Nhôm - Aluminum)',
    materialType: 'Hợp kim nhôm tái sinh 100%',
    recyclability: 'high',
    ecoScore: 94,
    co2SavedKg: 0.22,
    decompositionTime: '80 - 200 năm nếu bị chôn lấp',
    disposalGuide: [
      'Tráng sơ bằng nước để tránh thu hút côn trùng, kiến gián',
      'Gấp/bẹp lon để tối ưu không gian chứa',
      'Đưa vào thùng gom phế liệu kim loại'
    ],
    upcyclingTips: [
      'Làm ống cắm bút trang trí bàn làm việc phong cách Retro Industrial',
      'Làm khuôn đựng sáp nến thơm handmade'
    ],
    confidence: 0.98,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hôm qua, 15:45',
    boundingBoxes: [
      { label: 'Lon nhôm 330ml', confidence: 0.99, box: [20, 30, 40, 60], color: '#10b981' }
    ],
    materialBreakdowns: [
      { name: 'Hợp kim nhôm tái sinh', percentage: 98, recyclable: true, color: '#10b981' },
      { name: 'Mực in bề mặt', percentage: 2, recyclable: false, color: '#94a3b8' }
    ]
  },
  {
    id: 'scan-3',
    itemName: 'Hộp sữa tươi Tetra Pak',
    category: 'paper',
    categoryNameVi: 'Giấy phức hợp (Aseptic Carton)',
    materialType: '75% giấy bìa cứng, 20% màng PE, 5% nhôm siêu mỏng',
    recyclability: 'medium',
    ecoScore: 68,
    co2SavedKg: 0.12,
    decompositionTime: '5 - 10 năm nếu chôn lấp',
    disposalGuide: [
      'Mở 4 góc tai hộp và dẫm phẳng hoàn toàn',
      'Tráng sạch cặn sữa bên trong và phơi khô ráo',
      'Gửi đến các điểm thu gom vỏ hộp sữa của Tetra Pak hoặc siêu thị'
    ],
    upcyclingTips: [
      'Khay ươm cây mầm gia đình chống thấm nước tuyệt vời',
      'Gấp làm ví đựng thẻ mini handmade bền bỉ'
    ],
    confidence: 0.95,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    timestamp: '06/11/2026',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: {
      id: 'usr-2',
      name: 'Mai Lan (Zero-Waste)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      rankTitle: 'Đại Sứ Hành Tinh Xanh',
    },
    content: 'Chào cả nhà! Hôm nay mình vừa thu gom được 15 vỏ lon nước ép và dùng EcoScan AI để kiểm tra. Thật bất ngờ là nhôm có thể tái chế vô hạn lần mà không giảm chất lượng! ♻️ Mình đã mang tặng cho cô nhặt ve chai đầu ngõ và tích thêm được 150 Green Points. Hãy cùng chung tay nhé!',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    scanItemName: 'Vỏ lon nước ngọt bằng nhôm',
    tags: ['#ZeroWaste', '#TaiCheNhom', '#SongXanh', '#EcoScanAI'],
    likes: ['usr-current', 'usr-3', 'usr-5'],
    comments: [
      {
        id: 'c-1',
        author: {
          id: 'usr-3',
          name: 'Hoàng Long Green',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          rankTitle: 'Chuyên Gia Tái Sinh',
        },
        content: 'Tuyệt vời quá Lan ơi! Nhôm tái chế tiết kiệm tới 95% năng lượng so với luyện nhôm mới từ quặng bauxite đấy!',
        createdAt: '2 giờ trước',
      }
    ],
    createdAt: '3 giờ trước',
  },
  {
    id: 'post-2',
    author: {
      id: 'usr-4',
      name: 'Phương Linh Art',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
      rankTitle: 'Nghệ Nhân Sinh Thái',
    },
    content: 'Khoe với mọi người thành quả sau khi đọc gợi ý Upcycling từ app EcoScan: Những chiếc chậu cây treo siêu xinh được làm từ chai nước khoáng PET 1.5L cũ. Vừa xanh nhà lại chẳng tốn một xu mua chậu nhựa mới! 🪴✨',
    imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80',
    scanItemName: 'Chai nước khoáng nhựa rỗng (PET #1)',
    tags: ['#DIYUpcycling', '#TaiCheSangTao', '#ChauCayTaiChe'],
    likes: ['usr-current', 'usr-2'],
    comments: [],
    createdAt: '5 giờ trước',
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Biệt đội Phân loại Nhựa',
    description: 'Dùng AI quét và phân loại đúng cách 5 vật phẩm nhựa khó phân hủy trong tuần này.',
    rewardPoints: 120,
    category: 'Rác nhựa',
    progress: 3,
    maxProgress: 5,
    completed: false,
    icon: '🧴',
    expiresIn: 'Còn 3 ngày',
  },
  {
    id: 'ch-2',
    title: 'Chia sẻ Mẹo Xanh',
    description: 'Đăng 1 bài viết hoặc mẹo tái chế hữu ích lên Eco Feed để truyền cảm hứng cộng đồng.',
    rewardPoints: 100,
    category: 'Cộng đồng',
    progress: 1,
    maxProgress: 1,
    completed: true,
    icon: '📢',
    expiresIn: 'Đã hoàn thành',
  },
  {
    id: 'ch-3',
    title: 'Ủ Phân Hữu Cơ / Giảm Lãng Phí Thực Phẩm',
    description: 'Quét 3 loại phế phẩm rau củ quả hoặc bã cà phê và tái sử dụng làm phân bón hữu cơ.',
    rewardPoints: 150,
    category: 'Rác hữu cơ',
    progress: 2,
    maxProgress: 3,
    completed: false,
    icon: '🍎',
    expiresIn: 'Còn 4 ngày',
  }
];

// EcoBot Chat initial history
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'bot',
    text: 'Xin chào! Tôi là **EcoBot AI** 🤖🌱 - Trợ lý cố vấn sinh thái thông minh của bạn.\n\nTôi có thể giúp bạn giải đáp mọi thắc mắc về phân loại rác thải, kiểm tra khả năng tái chế, hướng dẫn ủ phân hữu cơ (compost), gợi ý ý tưởng DIY hoặc tìm điểm thu gom gần bạn nhất. Hãy hỏi tôi bất cứ điều gì nhé!',
    timestamp: 'Vừa xong',
    suggestions: [
      'Pin cũ vứt ở đâu an toàn?',
      'Cách phân biệt các loại nhựa #1 đến #7?',
      'Làm sao khử mùi thùng rác hữu cơ tại nhà?',
      'Gợi ý tái chế chai thủy tinh cũ'
    ]
  }
];

// Digital Eco Map Locations across Vietnam
export const INITIAL_LOCATIONS: EcoLocation[] = [
  {
    id: 'loc-1',
    name: 'Điểm Thu Gom Pin Cũ & Rác Điện Tử - Circle K Hoàn Kiếm',
    category: 'battery_ewaste',
    categoryNameVi: 'Thu gom Pin & Rác Điện Tử',
    address: 'Số 18 Hàng Bài, Phường Tràng Tiền, Quận Hoàn Kiếm',
    city: 'Hà Nội',
    distanceKm: 0.8,
    coordinates: { lat: 21.0254, lng: 105.8525 },
    acceptedMaterials: ['Pin AA/AAA', 'Pin điện thoại Lithium-ion', 'Sạc hỏng', 'Cáp dây điện cũ'],
    openingHours: '24/7 (Cả tuần)',
    phone: '024 3939 1234',
    verified: true,
    rewardPointsBonus: 50,
  },
  {
    id: 'loc-2',
    name: 'Trạm Thu Hồi Vỏ Hộp Sữa Giấy Tetra Pak - Co.opmart Cống Quỳnh',
    category: 'recycling_center',
    categoryNameVi: 'Trạm Thu Gom Phế Liệu & Giấy',
    address: '189C Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 1.2,
    coordinates: { lat: 10.7672, lng: 106.6876 },
    acceptedMaterials: ['Vỏ hộp sữa giấy', 'Bìa carton sạch', 'Chai nhựa PET', 'Vỏ lon nhôm'],
    openingHours: '08:00 - 22:00 hàng ngày',
    phone: '028 3832 5283',
    verified: true,
    rewardPointsBonus: 40,
  },
  {
    id: 'loc-3',
    name: 'Lại Đây Refill Station - Trạm Làm Đầy Sống Xanh',
    category: 'refill_station',
    categoryNameVi: 'Trạm Refill Không Rác Thải',
    address: 'Số 83 Đường số 4, Thảo Điền, Quận 2 (TP. Thủ Đức)',
    city: 'TP. Hồ Chí Minh',
    distanceKm: 3.5,
    coordinates: { lat: 10.8034, lng: 106.7324 },
    acceptedMaterials: ['Mang chai lọ sạch đến để mua dầu gội, nước rửa chén, xà phòng tự nhiên'],
    openingHours: '09:00 - 19:30 (Thứ 3 - Chủ Nhật)',
    phone: '090 912 3456',
    verified: true,
    rewardPointsBonus: 80,
  },
  {
    id: 'loc-4',
    name: 'Trung Tâm Tái Sinh & Trao Đổi Đồ Điện Tử GreenHub',
    category: 'battery_ewaste',
    categoryNameVi: 'Thu gom Pin & Rác Điện Tử',
    address: 'Tầng 1, Nhà C1 ĐH Bách Khoa, Số 1 Đại Cồ Việt, Hai Bà Trưng',
    city: 'Hà Nội',
    distanceKm: 2.1,
    coordinates: { lat: 21.0051, lng: 105.8436 },
    acceptedMaterials: ['Máy tính bảng, laptop cũ', 'Bàn phím, chuột', 'Màn hình hỏng', 'Bo mạch điện tử'],
    openingHours: '08:30 - 17:30 (Thứ 2 - Thứ 6)',
    phone: '024 3869 2008',
    verified: true,
    rewardPointsBonus: 100,
  },
  {
    id: 'loc-5',
    name: 'Điểm Phân Loại Rác Thông Minh Công Viên Cầu Giấy',
    category: 'public_bin',
    categoryNameVi: 'Thùng Rác Phân Loại Thông Minh',
    address: 'Đường Thành Thái, Dịch Vọng, Quận Cầu Giấy',
    city: 'Hà Nội',
    distanceKm: 4.0,
    coordinates: { lat: 21.0289, lng: 105.7903 },
    acceptedMaterials: ['Thùng xanh: Rác hữu cơ', 'Thùng vàng: Rác tái chế', 'Thùng đỏ: Rác nguy hại'],
    openingHours: '24/7 Công viên mở cửa',
    phone: '1900 6868',
    verified: true,
    rewardPointsBonus: 20,
  },
  {
    id: 'loc-6',
    name: 'Điểm Thu Nhận Phế Liệu Tái Chế Đà Nẵng Xanh',
    category: 'recycling_center',
    categoryNameVi: 'Trạm Thu Gom Phế Liệu & Giấy',
    address: '120 Bạch Đằng, Quận Hải Châu',
    city: 'Đà Nẵng',
    distanceKm: 1.5,
    coordinates: { lat: 16.0678, lng: 108.2208 },
    acceptedMaterials: ['Kim loại', 'Chai lọ thủy tinh', 'Giấy vụn sách báo', 'Nhựa các loại'],
    openingHours: '07:30 - 18:00',
    phone: '0236 382 1234',
    verified: true,
    rewardPointsBonus: 40,
  }
];

// Environmental Alerts & Hotspots
export const INITIAL_ALERTS: EcoAlert[] = [
  {
    id: 'alt-1',
    title: 'Cảnh báo Chất Lượng Không Khí (AQI): Mức Kém tại Hà Nội',
    description: 'Chỉ số bụi mịn PM2.5 vượt ngưỡng 158 AQI tại khu vực Cầu Giấy và Hoàn Kiếm do nghịch nhiệt và sương mù ô nhiễm. Khuyến cáo đeo khẩu trang chống bụi N95 khi di chuyển ngoài trời và hạn chế đốt rác nông nghiệp.',
    type: 'aqi_warning',
    severity: 'warning',
    status: 'active',
    location: 'Hà Nội (Khu vực nội thành)',
    reportedBy: 'Hệ thống Cảm biến Môi trường EcoSense',
    reportedAt: '1 giờ trước',
    upvotes: 42,
    volunteersJoined: 0,
  },
  {
    id: 'alt-2',
    title: 'Điểm nóng ô nhiễm: Bãi rác tự phát ngập bao bì nhựa ven kênh Nhiêu Lộc',
    description: 'Phát hiện bãi xả rác thải sinh hoạt và bao bì nilon trái phép dài khoảng 25m gần chân cầu số 6. Cần 10 - 15 tình nguyện viên tham gia chiến dịch làm sạch cuối tuần này.',
    type: 'waste_hotspot',
    severity: 'critical',
    status: 'active',
    location: 'Đoạn bờ kênh Nhiêu Lộc - Thị Nghè, Quận 3, TP.HCM',
    reportedBy: 'Hoàng Long Green',
    reportedAt: '3 giờ trước',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    upvotes: 89,
    volunteersJoined: 12,
  },
  {
    id: 'alt-3',
    title: 'Chiến dịch xanh: Ra quân dọn sạch rác bờ kè Hồ Tây',
    description: 'Chiến dịch định kỳ nhặt rác nhựa, chai thủy tinh và tàn thuốc lá ven hồ Tây. Ban tổ chức chuẩn bị găng tay y tế, kẹp gắp rác và túi đựng sinh học tự hủy.',
    type: 'clean_campaign',
    severity: 'info',
    status: 'in_progress',
    location: 'Bến thuyền hồ Tây, Phố Nhật Chiêu, Tây Hồ, Hà Nội',
    reportedBy: 'Nhóm Tình Nguyện Hanoi Zero-Waste',
    reportedAt: 'Hôm qua',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
    upvotes: 135,
    volunteersJoined: 28,
  }
];

// Community Marketplace Items (Chợ Xanh 0 Đồng)
export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item-1',
    title: 'Tặng 10 hũ thủy tinh sạch đựng thực phẩm / gia vị',
    description: 'Mình vừa ăn hết pate và sốt cà chua, đã luộc khử trùng sạch sẽ và bóc sạch nhãn. Ai làm nến thơm hay đựng gia vị qua lấy miễn phí nhé!',
    category: 'Chai lọ & Hộp',
    condition: 'Như mới (95%)',
    owner: {
      id: 'usr-2',
      name: 'Mai Lan (Zero-Waste)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
    location: 'Quận 1, TP.HCM',
    isFree: true,
    status: 'available',
    createdAt: 'Hôm nay',
  },
  {
    id: 'item-2',
    title: 'Bộ chậu sen đá làm từ chai nhựa PET tái chế',
    description: 'Tự tay mình cắt dán và sơn màu acrylic sinh học. Đổi lấy 50 Green Points hoặc tặng bạn nào thích trồng cây xanh góc bàn.',
    category: 'Cây cảnh & Tái chế',
    condition: 'Mới 100%',
    owner: {
      id: 'usr-4',
      name: 'Phương Linh Art',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    location: 'Quận Đống Đa, Hà Nội',
    isFree: false,
    greenPointsPrice: 50,
    status: 'available',
    createdAt: 'Hôm qua',
  }
];

// Green Events
export const INITIAL_EVENTS: GreenEvent[] = [
  {
    id: 'evt-1',
    title: 'Ngày hội "Đổi Pin Cũ Lấy Cây Sen Đá & Túi Vải Canvas"',
    description: 'Cứ 10 viên pin đã qua sử dụng bất kỳ sẽ được đổi lấy 1 chậu sen đá mini hoặc 1 túi vải canvas dệt từ sợi bông hữu cơ. Toàn bộ pin thu gom sẽ chuyển giao trực tiếp cho nhà máy xử lý chất thải nguy hại.',
    date: 'Thứ Bảy, 14/11/2026',
    time: '08:30 - 16:30',
    location: 'Sân Nhà Thiếu Nhi TP.HCM, Số 169 Nam Kỳ Khởi Nghĩa, Quận 3',
    organizer: 'Mạng Lưới Hành Tinh Xanh Việt Nam',
    participantsCount: 142,
    maxParticipants: 200,
    rewardPoints: 100,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    isJoined: true,
  },
  {
    id: 'evt-2',
    title: 'Workshop Trực Tiếp: Nghệ Thuật Ủ Phân Hữu Cơ Bokashi Tại Căn Hộ Chung Cư',
    description: 'Học cách biến 100% rác nhà bếp (vỏ trái cây, rau úa, bã trà) thành men vi sinh không mùi hôi chỉ trong thùng 10 lít đặt tại góc bếp hoặc ban công nhỏ.',
    date: 'Chủ Nhật, 15/11/2026',
    time: '09:00 - 11:30',
    location: 'Phòng Hội Thảo EcoHub, Tầng 3 Tòa Nhà Green Tower, Cầu Giấy, Hà Nội',
    organizer: 'Chuyên Gia Môi Trường Hoàng Long',
    participantsCount: 45,
    maxParticipants: 50,
    rewardPoints: 80,
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    isJoined: false,
  }
];
