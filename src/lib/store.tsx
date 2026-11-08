'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ScanResult,
  Post,
  Challenge,
  Comment,
  ChatMessage,
  EcoLocation,
  EcoAlert,
  MarketplaceItem,
  GreenEvent,
} from '@/types';
import {
  CURRENT_USER,
  SAMPLE_USERS,
  INITIAL_SCANS,
  INITIAL_POSTS,
  INITIAL_CHALLENGES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_LOCATIONS,
  INITIAL_ALERTS,
  INITIAL_MARKETPLACE,
  INITIAL_EVENTS,
} from './sample-data';

interface EcoStoreContextType {
  user: User | null;
  users: User[];
  scans: ScanResult[];
  posts: Post[];
  challenges: Challenge[];
  chatMessages: ChatMessage[];
  locations: EcoLocation[];
  alerts: EcoAlert[];
  marketplaceItems: MarketplaceItem[];
  events: GreenEvent[];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  login: (userOrEmail: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  addScanResult: (result: Omit<ScanResult, 'id' | 'timestamp'>) => ScanResult;
  createPost: (content: string, imageUrl?: string, scanItemName?: string, tags?: string[]) => Post;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  claimChallenge: (challengeId: string) => void;
  updateUserBio: (bio: string) => void;
  // New features:
  sendChatMessage: (text: string, scanItemAttachment?: ScanResult) => Promise<void>;
  clearChat: () => void;
  addLocation: (loc: Omit<EcoLocation, 'id'>) => void;
  addAlert: (alert: Omit<EcoAlert, 'id' | 'reportedAt' | 'upvotes' | 'volunteersJoined'>) => void;
  upvoteAlert: (alertId: string) => void;
  joinAlertCampaign: (alertId: string) => void;
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'owner' | 'createdAt' | 'status'>) => void;
  claimMarketplaceItem: (itemId: string) => void;
  toggleJoinEvent: (eventId: string) => void;
}

const EcoStoreContext = createContext<EcoStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'ecoscan_user',
  SCANS: 'ecoscan_scans',
  POSTS: 'ecoscan_posts',
  CHALLENGES: 'ecoscan_challenges',
  CHAT: 'ecoscan_chat',
  LOCATIONS: 'ecoscan_locations',
  ALERTS: 'ecoscan_alerts',
  MARKETPLACE: 'ecoscan_marketplace',
  EVENTS: 'ecoscan_events',
  API_KEY: 'ecoscan_gemini_key',
};

// Preset EcoBot responses grounded directly on the 10-Class Archive Dataset (12,259 samples)
function getBotResponse(userPrompt: string): { reply: string; suggestions?: string[] } {
  const q = userPrompt.toLowerCase();

  if (q.includes('pin') || q.includes('battery')) {
    return {
      reply: '🔋 **Phân loại Pin & Rác Điện Tử (Đối chiếu nhóm `battery` - 756 mẫu thực tế trong Dataset Archive):**\n\n' +
        '1. **Nguy hại cao:** Pin chứa kim loại nặng độc hại (Chì, Cadmium, Thủy ngân). 1 viên pin cúc áo bị rò rỉ có thể làm ô nhiễm 500 lít nước ngầm trong 50 năm.\n' +
        '2. **Cách xử lý chuẩn:** Dán băng dính vào 2 cực (+ và -), đựng trong hũ thủy tinh kín và mang tới điểm thu gom miễn phí (VinMart+, Circle K, ĐH Bách Khoa trên mục **Bản Đồ Số**).\n' +
        '3. **Giải pháp xanh:** Chuyển sang sử dụng pin sạc NiMH để tái sử dụng tới 1.000 lần.',
      suggestions: ['Mở bản đồ tìm điểm thu gom pin', 'Pin lithium-ion điện thoại xử lý thế nào?']
    };
  }

  if (q.includes('ao') || q.includes('quan') || q.includes('vai') || q.includes('clothes') || q.includes('textile')) {
    return {
      reply: '👕 **Phân loại Quần Áo & Vải Cũ (Đối chiếu nhóm `clothes` - 1.892 mẫu trong Dataset Archive):**\n\n' +
        '• **Tình trạng còn tốt (90-95%):** Đừng vứt đi! Hãy vào tab **"Chợ Xanh 0 Đồng"** trên ứng dụng để đăng cho/tặng hoặc gửi tới các tủ quần áo từ thiện.\n' +
        '• **Vải rách / sờn cũ:** Cắt làm giẻ lau thấm nước gia đình hoặc gửi tới các đơn vị kéo sợi tái sinh làm bông cách âm, cách nhiệt.\n' +
        '• **Tác động môi trường:** Tái sử dụng 1 chiếc áo thun cotton giúp tiết kiệm tới 2.700 lít nước sạch!',
      suggestions: ['Đăng tặng quần áo lên Chợ Xanh', 'Cách tái chế ống quần jeans cũ làm túi']
    };
  }

  if (q.includes('giay') || q.includes('dep') || q.includes('shoes') || q.includes('sneaker')) {
    return {
      reply: '👟 **Phân loại Giày Dép Cũ (Đối chiếu nhóm `shoes` - 1.449 mẫu trong Dataset Archive):**\n\n' +
        '• Giày thể thao cũ thường có cấu tạo phức tạp: đế xốp EVA, cao su lưu hóa, keo dán và da tổng hợp PU (cần 50 - 100 năm để phân hủy).\n' +
        '• **Cách xử lý:** Tháo rời dây giày (dây giày giặt sạch dùng lại cực bền). Nếu giày còn êm, hãy vệ sinh sạch và quyên góp.\n' +
        '• **Sáng tạo Upcycling:** Tận dụng thân giày cũ làm chậu trồng hoa mười giờ, sen đá độc đáo ngoài ban công!',
      suggestions: ['Làm chậu cây từ giày cũ', 'Quyên góp giày thể thao']
    };
  }

  if (q.includes('carton') || q.includes('hop') || q.includes('cardboard') || q.includes('bia')) {
    return {
      reply: '📦 **Phân loại Bìa Các-tông (Đối chiếu nhóm `cardboard` - 1.411 mẫu trong Dataset Archive):**\n\n' +
        '• Bìa carton sóng có khả năng tái chế lên tới 100% thành bột giấy mới nếu được giữ khô ráo.\n' +
        '• **Quy trình 3 bước:** Bóc toàn bộ băng keo dán nilông → Tháo ghim bấm kim loại → Gấp phẳng để tối ưu thể tích thu gom.\n' +
        '• **Mẹo:** Bìa carton xé nhỏ là nguồn chất xơ Carbon (Nâu) tuyệt vời để trộn vào thùng ủ phân compost vi sinh gia đình!',
      suggestions: ['Làm nhà cho mèo từ hộp carton', 'Quy tắc ủ phân compost 50/50']
    };
  }

  if (q.includes('nhua') || q.includes('plastic') || q.includes('pet')) {
    return {
      reply: '🧴 **Phân loại Nhựa (Đối chiếu nhóm `plastic` - 1.597 mẫu trong Dataset Archive):**\n\n' +
        '- **#1 PET** (Chai nước khoáng, nước ngọt): *Tái chế rất cao*. Nhớ tháo nắp và dẫm bẹp!\n' +
        '- **#2 HDPE** (Bình sữa, can nước giặt): *Tái chế an toàn và bền bỉ*.\n' +
        '- **#3 PVC** (Ống nước): *Chứa phụ gia clo độc, khó tái chế*.\n' +
        '- **#4 LDPE** (Túi nilon, màng bọc): *Cần gom riêng các cơ sở chuyên biệt*.\n' +
        '- **#5 PP** (Hộp cơm lò vi sóng, nắp chai): *Chịu nhiệt tốt, tái chế cao*.\n' +
        '- **#6 PS** (Hộp xốp): *Không nên đựng đồ ăn nóng, hạn chế dùng*.',
      suggestions: ['Làm chậu cây từ chai nhựa #1', 'Cách thay thế túi nilon']
    };
  }

  if (q.includes('compost') || q.includes('huu co') || q.includes('rau') || q.includes('ca phe') || q.includes('biological')) {
    return {
      reply: '🌱 **Phân loại Rác Sinh Học / Hữu Cơ (Đối chiếu nhóm `biological` - 699 mẫu trong Dataset Archive):**\n\n' +
        '1. **Quy tắc 50/50:** Trộn đều nguyên liệu **Xanh** (vỏ rau củ, bã cà phê, xác trà giàu Nitơ) với nguyên liệu **Nâu** (lá khô, bìa carton vụn giàu Carbon).\n' +
        '2. **Tuyệt đối không bỏ vào:** Thịt cá mỡ, thức ăn dầu mỡ nhiều, phân thú cưng (dễ sinh mùi hôi).\n' +
        '3. **Khử mùi:** Rắc bã cà phê phơi khô hoặc men vi sinh Bokashi / EM1 lên bề mặt.\n' +
        'Sau 3 - 4 tuần, bạn sẽ có lớp phân mùn hữu cơ đen giàu dinh dưỡng cho vườn cây ban công!',
      suggestions: ['Bã cà phê khử mùi thế nào?', 'Tham gia workshop ủ phân cuối tuần']
    };
  }

  if (q.includes('thuy tinh') || q.includes('glass')) {
    return {
      reply: '🍶 **Phân loại Thủy Tinh (Đối chiếu nhóm `glass` - 1.736 mẫu trong Dataset Archive):**\n\n' +
        '• Thủy tinh thực phẩm tái sinh 100% không giới hạn số lần mà không suy giảm chất lượng.\n' +
        '• **Lưu ý:** Rửa sạch cặn thức ăn, tháo nắp kim loại/nhựa. Không vứt chung với kính xây dựng vỡ hay bóng đèn.\n' +
        '• **Mẹo:** Đăng tặng hũ mứt, lọ thủy tinh sạch lên **Chợ Xanh 0 Đồng** cho những bạn làm nến thơm handmade.',
      suggestions: ['Đăng tặng hũ thủy tinh lên Chợ Xanh', 'Làm đèn ngủ từ chai thủy tinh']
    };
  }

  return {
    reply: `Chào bạn! Đối chiếu với **Cơ sở dữ liệu 10 nhóm rác thải chuẩn hóa (12.259 mẫu thực tế trong archive)**:\n\n` +
      `Về câu hỏi **"${userPrompt}"**:\n` +
      '• Hệ thống EcoScan AI hỗ trợ phân loại 10 nhóm: `battery` (pin), `biological` (hữu cơ), `cardboard` (bìa carton), `clothes` (quần áo), `glass` (thủy tinh), `metal` (kim loại), `paper` (giấy), `plastic` (nhựa), `shoes` (giày dép), `trash` (rác tạp).\n' +
      '• Bạn có thể chụp ảnh hoặc tải ảnh lên mục **Quét AI (/scan)** hoặc mở mục **Kho Dataset (/dataset)** để xem và đối chiếu các mẫu thực tế tương đồng.\n' +
      '• Đừng quên kiểm tra mục **Bản Đồ Số (/map)** để tìm điểm thu gom chuyên biệt gần nhất nhé! 🌍✨',
    suggestions: [
      'Pin cũ vứt ở đâu an toàn?',
      'Quần áo cũ tái chế thế nào?',
      'Phân biệt các loại nhựa #1 đến #7?',
      'Cách ủ phân hữu cơ tại ban công'
    ]
  };
}

export function EcoStoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [scans, setScans] = useState<ScanResult[]>(INITIAL_SCANS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [locations, setLocations] = useState<EcoLocation[]>(INITIAL_LOCATIONS);
  const [alerts, setAlerts] = useState<EcoAlert[]>(INITIAL_ALERTS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [events, setEvents] = useState<GreenEvent[]>(INITIAL_EVENTS);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedScans = localStorage.getItem(STORAGE_KEYS.SCANS);
      if (savedScans) setScans(JSON.parse(savedScans));

      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (savedPosts) setPosts(JSON.parse(savedPosts));

      const savedChallenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (savedChallenges) setChallenges(JSON.parse(savedChallenges));

      const savedChat = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (savedChat) setChatMessages(JSON.parse(savedChat));

      const savedLocations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      if (savedLocations) setLocations(JSON.parse(savedLocations));

      const savedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));

      const savedMarketplace = localStorage.getItem(STORAGE_KEYS.MARKETPLACE);
      if (savedMarketplace) setMarketplaceItems(JSON.parse(savedMarketplace));

      const savedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (savedKey) setGeminiApiKeyState(savedKey);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [user, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
    } catch (e) {
      console.warn(e);
    }
  }, [scans, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn(e);
    }
  }, [posts, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (e) {
      console.warn(e);
    }
  }, [challenges, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn(e);
    }
  }, [chatMessages, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn(e);
    }
  }, [alerts, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.warn(e);
    }
  }, [locations, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplaceItems));
    } catch (e) {
      console.warn(e);
    }
  }, [marketplaceItems, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn(e);
    }
  }, [events, mounted]);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    }
  };

  const login = (nameOrEmail: string) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === nameOrEmail.toLowerCase() || u.name.toLowerCase() === nameOrEmail.toLowerCase()
    );
    if (existing) {
      setUser(existing);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail,
        email: nameOrEmail.includes('@') ? nameOrEmail : `${nameOrEmail.toLowerCase().replace(/\s+/g, '')}@eco.vn`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${nameOrEmail}`,
        greenPoints: 100,
        ecoRank: users.length + 1,
        rankTitle: 'Tân Binh Sinh Thái (Eco Newbie)',
        bio: 'Thành viên mới gia nhập cộng đồng sống xanh!',
        badges: [
          {
            id: 'badge-welcome',
            title: 'Mầm Xanh Tân Thủ',
            description: 'Chào mừng bạn tham gia mạng lưới EcoScan AI',
            icon: '🌱',
            unlockedAt: new Date().toISOString().split('T')[0],
            requirement: 'Đăng ký tài khoản',
          },
        ],
        scanCount: 0,
        co2SavedKg: 0,
        joinedDate: 'Vừa tham gia',
      };
      setUser(newUser);
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) setUser(found);
  };

  const addScanResult = (resultData: Omit<ScanResult, 'id' | 'timestamp'>) => {
    const newScan: ScanResult = {
      ...resultData,
      id: `scan-${Date.now()}`,
      timestamp: 'Vừa xong',
    };

    setScans((prev) => [newScan, ...prev]);

    // Update user points
    if (user) {
      const pointsEarned = Math.round(resultData.ecoScore * 0.5 + 20);
      const updatedUser: User = {
        ...user,
        greenPoints: user.greenPoints + pointsEarned,
        scanCount: user.scanCount + 1,
        co2SavedKg: +(user.co2SavedKg + resultData.co2SavedKg).toFixed(2),
      };
      setUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    }

    // Advance challenges
    setChallenges((prev) =>
      prev.map((ch) => {
        if (!ch.completed && ch.progress < ch.maxProgress) {
          const nextProg = ch.progress + 1;
          return {
            ...ch,
            progress: nextProg,
            completed: nextProg >= ch.maxProgress,
          };
        }
        return ch;
      })
    );

    return newScan;
  };

  const createPost = (
    content: string,
    imageUrl?: string,
    scanItemName?: string,
    tags: string[] = ['#EcoScan', '#SongXanh']
  ) => {
    const authorInfo = user
      ? {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rankTitle: user.rankTitle,
        }
      : {
          id: 'usr-guest',
          name: 'Khách yêu môi trường',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          rankTitle: 'Người bạn sinh thái',
        };

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: authorInfo,
      content,
      imageUrl,
      scanItemName,
      tags: tags.length ? tags : ['#ZeroWaste', '#EcoScanAI'],
      likes: [],
      comments: [],
      createdAt: 'Vừa xong',
    };

    setPosts((prev) => [newPost, ...prev]);

    if (user) {
      const updatedUser = {
        ...user,
        greenPoints: user.greenPoints + 30,
      };
      setUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    }

    return newPost;
  };

  const likePost = (postId: string) => {
    const currentUserId = user ? user.id : 'usr-guest';
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const hasLiked = post.likes.includes(currentUserId);
        const newLikes = hasLiked
          ? post.likes.filter((id) => id !== currentUserId)
          : [...post.likes, currentUserId];
        return {
          ...post,
          likes: newLikes,
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const author = user
      ? {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rankTitle: user.rankTitle,
        }
      : {
          id: 'usr-guest',
          name: 'Ẩn danh',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          rankTitle: 'Thành viên xanh',
        };

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author,
      content: text.trim(),
      createdAt: 'Vừa xong',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      })
    );
  };

  const claimChallenge = (challengeId: string) => {
    const challenge = challenges.find((ch) => ch.id === challengeId);
    if (!challenge || !challenge.completed) return;

    if (user) {
      const updatedUser = {
        ...user,
        greenPoints: user.greenPoints + challenge.rewardPoints,
      };
      setUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    }
  };

  const updateUserBio = (bio: string) => {
    if (!user) return;
    const updated = { ...user, bio };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  // Chatbot methods
  const sendChatMessage = async (text: string, scanItemAttachment?: ScanResult) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Vừa xong',
      scanItemAttachment,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Try calling server api /api/chat if available, or use smart bot engine
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
        },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const botMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'bot',
            text: data.reply,
            timestamp: 'Vừa xong',
            suggestions: data.suggestions || ['Làm sao phân loại pin cũ?', 'Cách làm phân compost tại nhà?'],
          };
          setChatMessages((prev) => [...prev, botMsg]);
          return;
        }
      }
    } catch (err) {
      console.warn('API /api/chat fallback:', err);
    }

    // Smart fallback simulator
    await new Promise((r) => setTimeout(r, 600));
    const { reply, suggestions } = getBotResponse(text);
    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: reply,
      timestamp: 'Vừa xong',
      suggestions,
    };
    setChatMessages((prev) => [...prev, botMsg]);
  };

  const clearChat = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
  };

  // Location methods
  const addLocation = (loc: Omit<EcoLocation, 'id'>) => {
    const newLoc: EcoLocation = {
      ...loc,
      id: `loc-${Date.now()}`,
    };
    setLocations((prev) => [newLoc, ...prev]);
    if (user) {
      setUser({ ...user, greenPoints: user.greenPoints + 50 });
    }
  };

  // Eco Alert methods
  const addAlert = (alertData: Omit<EcoAlert, 'id' | 'reportedAt' | 'upvotes' | 'volunteersJoined'>) => {
    const newAlert: EcoAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      reportedAt: 'Vừa xong',
      upvotes: 1,
      volunteersJoined: 0,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (user) {
      setUser({ ...user, greenPoints: user.greenPoints + 40 });
    }
  };

  const upvoteAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, upvotes: alt.upvotes + 1 } : alt))
    );
  };

  const joinAlertCampaign = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === alertId ? { ...alt, volunteersJoined: alt.volunteersJoined + 1 } : alt
      )
    );
    if (user) {
      setUser({ ...user, greenPoints: user.greenPoints + 50 });
    }
  };

  // Marketplace & Events
  const addMarketplaceItem = (itemData: Omit<MarketplaceItem, 'id' | 'owner' | 'createdAt' | 'status'>) => {
    const author = user
      ? { id: user.id, name: user.name, avatar: user.avatar }
      : { id: 'usr-guest', name: 'Thành viên xanh', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' };

    const newItem: MarketplaceItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      owner: author,
      status: 'available',
      createdAt: 'Vừa xong',
    };
    setMarketplaceItems((prev) => [newItem, ...prev]);
  };

  const claimMarketplaceItem = (itemId: string) => {
    setMarketplaceItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: 'claimed' } : item))
    );
  };

  const toggleJoinEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const nextState = !evt.isJoined;
        if (nextState && user) {
          setUser({ ...user, greenPoints: user.greenPoints + evt.rewardPoints });
        }
        return {
          ...evt,
          isJoined: nextState,
          participantsCount: nextState ? evt.participantsCount + 1 : evt.participantsCount - 1,
        };
      })
    );
  };

  return (
    <EcoStoreContext.Provider
      value={{
        user,
        users,
        scans,
        posts,
        challenges,
        chatMessages,
        locations,
        alerts,
        marketplaceItems,
        events,
        geminiApiKey,
        setGeminiApiKey,
        login,
        logout,
        switchUser,
        addScanResult,
        createPost,
        likePost,
        addComment,
        claimChallenge,
        updateUserBio,
        sendChatMessage,
        clearChat,
        addLocation,
        addAlert,
        upvoteAlert,
        joinAlertCampaign,
        addMarketplaceItem,
        claimMarketplaceItem,
        toggleJoinEvent,
      }}
    >
      {children}
    </EcoStoreContext.Provider>
  );
}

export function useEcoStore() {
  const context = useContext(EcoStoreContext);
  if (!context) {
    throw new Error('useEcoStore must be used within an EcoStoreProvider');
  }
  return context;
}
