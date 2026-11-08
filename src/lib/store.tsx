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

// Preset EcoBot responses for rich intelligent conversational fallback
function getBotResponse(userPrompt: string): { reply: string; suggestions?: string[] } {
  const q = userPrompt.toLowerCase();

  if (q.includes('pin') || q.includes('battery')) {
    return {
      reply: '🔋 **Hướng dẫn xử lý Pin cũ đã qua sử dụng:**\n\n' +
        '1. **TUYỆT ĐỐI KHÔNG** vứt pin chung với rác sinh hoạt hoặc đốt rác, vì pin chứa kim loại nặng nguy hiểm (Chì, Thủy ngân, Cadmium) làm ô nhiễm đất và nước ngầm hàng trăm năm.\n' +
        '2. **Bảo quản an toàn:** Dán băng dính vào 2 cực của pin để tránh chập mạch cháy nổ, chứa trong lọ thủy tinh đậy kín.\n' +
        '3. **Điểm thu gom miễn phí:** Bạn có thể mở mục **Bản Đồ Số (/map)** trên thanh menu để tìm điểm thu gom gần nhất (chuỗi Circle K, ĐH Bách Khoa, VinMart+...).\n\n' +
        '🌱 *Mẹo nhỏ:* Hãy chuyển sang sử dụng pin sạc lại (Rechargeable NiMH) để tái sử dụng tới 1.000 lần nhé!',
      suggestions: ['Mở bản đồ tìm điểm thu gom pin', 'Pin lithium-ion điện thoại có tái chế được không?']
    };
  }

  if (q.includes('nhua') || q.includes('plastic') || q.includes('pet')) {
    return {
      reply: '🧴 **Phân loại 7 ký hiệu Nhựa phổ biến:**\n\n' +
        '- **#1 PET/PETE** (Chai nước, dầu ăn): *Tái chế rất tốt*. Nhớ tháo nắp và dẫm bẹp!\n' +
        '- **#2 HDPE** (Bình sữa chua, can nước giặt): *Tái chế an toàn và bền bỉ*.\n' +
        '- **#3 PVC** (Ống nước, màng bọc cũ): *Khó tái chế, chứa độc tố*.\n' +
        '- **#4 LDPE** (Túi nilon, màng bọc khí): *Cần gom riêng các cơ sở chuyên biệt*.\n' +
        '- **#5 PP** (Hộp cơm lò vi sóng, nắp chai): *Chịu nhiệt tốt, tái chế cao*.\n' +
        '- **#6 PS** (Hộp xốp, thìa nhựa dùng 1 lần): *Cực kỳ độc khi gặp nhiệt độ cao, hạn chế tối đa*.\n' +
        '- **#7 Other** (Nhựa tổng hợp/PC): Khó tái chế, nên thay bằng thủy tinh/inox.',
      suggestions: ['Làm chậu cây từ chai nhựa #1', 'Cách thay thế túi nilon']
    };
  }

  if (q.includes('compost') || q.includes('huu co') || q.includes('rau') || q.includes('ca phe')) {
    return {
      reply: '🌱 **Bí quyết ủ Phân Hữu Cơ (Compost) không mùi hôi tại nhà:**\n\n' +
        '1. **Quy tắc Vàng 50/50:** Trộn đều nguyên liệu **Xanh** (giàu Nitơ: vỏ rau củ, bã cà phê, xác trà) với nguyên liệu **Nâu** (giàu Carbon: lá khô, bìa carton xé nhỏ, mùn cưa).\n' +
        '2. **Không bỏ vào:** Thịt cá, dầu mỡ động vật, phân thú cưng (vì dễ sinh dòi bọ và mùi hôi thối).\n' +
        '3. **Khử mùi tự nhiên:** Thêm một ít bã cà phê phơi khô hoặc men vi sinh Bokashi / EM1 rải đều lên trên.\n' +
        '4. Sau 3 - 4 tuần, bạn sẽ có lớp phân mùn đen giàu dinh dưỡng cho cây cảnh ban công!',
      suggestions: ['Bã cà phê khử mùi thế nào?', 'Tham gia workshop ủ phân cuối tuần']
    };
  }

  if (q.includes('thuy tinh') || q.includes('glass')) {
    return {
      reply: '🍶 **Thủy tinh - Vật liệu tuần hoàn vô hạn:**\n\n' +
        '- Thủy tinh có thể tái sinh 100% không giới hạn số lần mà không hề suy giảm độ tinh khiết hay độ bền.\n' +
        '- **Lưu ý khi phân loại:** Tráng sạch cặn bẩn bên trong, tháo nắp nhôm/nhựa. Không gom kính vỡ xây dựng hay bóng đèn chung với chai lọ thủy tinh thực phẩm.\n' +
        '- **Ý tưởng Upcycling:** Tái sử dụng làm bình cắm hoa sen đá, lọ đựng ngũ cốc khô hoặc gắn đèn led fairy light trang trí phòng ngủ.',
      suggestions: ['Đăng tặng hũ thủy tinh lên Chợ Xanh', 'Thời gian phân hủy thủy tinh là bao lâu?']
    };
  }

  return {
    reply: `Chào bạn! Về vấn đề **"${userPrompt}"**, theo nguyên tắc Kinh Tế Tuần Hoàn (5R - Refuse, Reduce, Reuse, Repurpose, Recycle):\n\n` +
      '• Hãy ưu tiên **Tái sử dụng (Reuse)** hoặc **Sáng tạo công năng mới (Repurpose/DIY)** trước khi đem đi tiêu hủy.\n' +
      '• Nếu đó là rác thải, bạn có thể vào mục **Quét AI (/scan)** chụp một bức ảnh để tôi phân tích phổ quang chất liệu, đo lường lượng CO₂ tiết kiệm và hướng dẫn xử lý chuẩn xác.\n' +
      '• Đừng quên kiểm tra mục **Bản Đồ Số (/map)** để tìm các trạm thu gom và điểm Refill gần bạn nhất nhé! 🌍✨',
    suggestions: [
      'Pin cũ vứt ở đâu an toàn?',
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
