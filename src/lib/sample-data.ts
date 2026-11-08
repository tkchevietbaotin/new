import { User, ScanResult, Post, Challenge, Badge } from '@/types';

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
    itemName: 'Chai nước khoáng nhựa rỗng',
    category: 'plastic',
    categoryNameVi: 'Rác nhựa (Plastic #1 - PET)',
    materialType: 'Polyethylene Terephthalate (PETE)',
    recyclability: 'high',
    ecoScore: 55,
    co2SavedKg: 0.08,
    decompositionTime: 'Khoảng 450 năm trong môi trường tự nhiên',
    disposalGuide: [
      'Đổ hết chất lỏng còn sót lại bên trong chai',
      'Tháo nắp nhựa (thường làm từ nhựa PP) và bóc màng co nilông nhãn mác',
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
  },
  {
    id: 'scan-2',
    itemName: 'Vỏ lon nước ngọt bằng nhôm',
    category: 'metal',
    categoryNameVi: 'Kim loại tái chế (Nhôm - Aluminum)',
    materialType: 'Hợp kim nhôm tái sinh 100%',
    recyclability: 'high',
    ecoScore: 92,
    co2SavedKg: 0.22,
    decompositionTime: '80 - 200 năm nếu bị chôn lấp',
    disposalGuide: [
      'Tráng sơ bằng nước để tránh thu hút côn trùng, kiến gián',
      'Gấp/bẹp lon để tối ưu không gian chứa',
      'Đưa vào thùng gom phế liệu kim loại'
    ],
    upcyclingTips: [
      'Làm ống cắm bút trang trí bàn làm việc phong cách Retro Industrial',
      'Làm khuôn đựng sáp nến thơm thơm phòng handmade'
    ],
    confidence: 0.98,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hôm qua, 15:45',
  },
  {
    id: 'scan-3',
    itemName: 'Ly cà phê take-away có tráng màng PE',
    category: 'paper',
    categoryNameVi: 'Giấy hỗn hợp (Poly-coated Paper)',
    materialType: 'Bột giấy nguyên sinh kết hợp màng tráng chống thấm PE',
    recyclability: 'low',
    ecoScore: 35,
    co2SavedKg: 0.03,
    decompositionTime: '20 - 30 năm (lớp màng nhựa cực khó tách rời)',
    disposalGuide: [
      'Tách nắp nhựa trong suốt (nhựa #5 hoặc #6) phân loại riêng',
      'Tháo rời vỏ bọc chống nóng bằng bìa carton nâu (loại này tái chế 100% được)',
      'Thân cốc do tráng nhựa PE mỏng nên các nhà máy thông thường không tái chế được, bỏ vào rác vô cơ/thông thường'
    ],
    upcyclingTips: [
      'Khuyến khích mang ly cá nhân (Tumbler/Thermos) để được giảm 5-10k khi mua cà phê!',
      'Có thể dùng cốc tạm thời làm khay ươm cây con trước khi chuyển ra đất'
    ],
    confidence: 0.93,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    timestamp: '06/11/2026',
  },
  {
    id: 'scan-4',
    itemName: 'Bã cà phê & Vỏ chuối nhà bếp',
    category: 'organic',
    categoryNameVi: 'Rác hữu cơ sinh hoạt (Organic)',
    materialType: 'Chất thải sinh khối giàu Nitơ & Kali tự nhiên',
    recyclability: 'high',
    ecoScore: 95,
    co2SavedKg: 0.35,
    decompositionTime: '2 - 4 tuần trong điều kiện ủ compost',
    disposalGuide: [
      'Không lẫn túi nilon hay tăm nhọn',
      'Cho vào xô ủ rác hữu cơ gia đình hoặc thùng rác hữu cơ màu xanh lá'
    ],
    upcyclingTips: [
      'Trộn bã cà phê vào đất trồng hoa hồng giúp xua đuổi ốc sên và tạo độ xốp',
      'Ngâm vỏ chuối vào nước 48 tiếng tạo phân bón lá Kali tuyệt vời cho cây cảnh',
      'Bã cà phê phơi khô làm túi hút ẩm, khử mùi tủ lạnh cực kỳ hiệu quả'
    ],
    confidence: 0.99,
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    timestamp: '05/11/2026',
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
      },
      {
        id: 'c-2',
        author: {
          id: 'usr-current',
          name: 'Bảo Tín',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          rankTitle: 'Chiến Binh Sinh Thái',
        },
        content: 'Một hành động nhỏ nhưng mang lại ý nghĩa lớn! Mình cũng vừa scan xong mấy chai nhựa nè.',
        createdAt: '45 phút trước',
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
    scanItemName: 'Chai nước khoáng nhựa rỗng',
    tags: ['#DIYUpcycling', '#TaiCheSangTao', '#ChauCayTaiChe'],
    likes: ['usr-current', 'usr-2'],
    comments: [
      {
        id: 'c-3',
        author: {
          id: 'usr-5',
          name: 'Đức Trí Eco',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
          rankTitle: 'Mầm Xanh Tiên Phong',
        },
        content: 'Khéo tay quá bạn ơi! Cắt có cần hơ lửa viền cho đỡ bén không ạ?',
        createdAt: '1 giờ trước',
      }
    ],
    createdAt: '5 giờ trước',
  },
  {
    id: 'post-3',
    author: {
      id: 'usr-current',
      name: 'Bảo Tín',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      rankTitle: 'Chiến Binh Sinh Thái',
    },
    content: 'Mẹo nhỏ cho ai thích uống cà phê: Đừng vứt bã cà phê đi nhé! Mình phơi khô bã cà phê để trong tủ lạnh, mùi thức ăn biến mất sạch sẽ sau 1 đêm luôn. Rác hữu cơ chính là tài nguyên nếu biết tận dụng đúng cách ☕🌱',
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    scanItemName: 'Bã cà phê & Vỏ chuối nhà bếp',
    tags: ['#MeoNhaBep', '#CompostTaiNha', '#KhuMuiTuNhien'],
    likes: ['usr-2', 'usr-3', 'usr-4', 'usr-5'],
    comments: [],
    createdAt: 'Hôm qua',
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
  },
  {
    id: 'ch-4',
    title: 'Dũng sĩ Không Ly Nhựa Dùng 1 Lần',
    description: 'Dùng bình nước cá nhân khi mua đồ uống suốt 5 ngày liên tục.',
    rewardPoints: 200,
    category: 'Thói quen xanh',
    progress: 4,
    maxProgress: 5,
    completed: false,
    icon: '🥤',
    expiresIn: 'Còn 2 ngày',
  }
];
