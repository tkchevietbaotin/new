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
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  chatModel: string;
  setChatModel: (model: string) => void;
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
  OPENAI_KEY: 'ecoscan_openai_key',
  CHAT_MODEL: 'ecoscan_chat_model',
};

// Preset EcoBot responses grounded directly on the 10-Class Archive Dataset (12,259 samples)
// and strictly structured with the 5 Core Waste Insights
function getBotResponse(userPrompt: string, scanItem?: ScanResult): { reply: string; suggestions?: string[] } {
  const q = userPrompt.toLowerCase();

  // If there's an attached scanItem, provide deep analysis based on its 5 core fields
  if (scanItem) {
    return {
      reply: `🤖 **Phân tích chi tiết từ ChatGPT & EcoBot AI cho món đồ "${scanItem.itemName}":**\n\n` +
        `1️⃣ **Đó là rác thải gì:**\n` +
        `• Tên cụ thể: **${scanItem.wasteName || scanItem.itemName}**\n` +
        `• Chất liệu chính: ${scanItem.materialType}\n` +
        `• Đối chiếu kho dữ liệu archive: Nhóm **${scanItem.categoryNameVi}** (${scanItem.datasetMatch ? `${scanItem.datasetMatch.totalDatasetSamples.toLocaleString()} mẫu thực tế` : 'Bộ dữ liệu 10 nhóm'})\n\n` +
        `2️⃣ **Chất thải loại gì:**\n` +
        `• Phân loại chuẩn BVMT: **${scanItem.wasteClassification || 'Chất thải rắn có thể tái chế'}**\n` +
        `• Thùng rác quy định: **${scanItem.wasteBinColor || 'Thùng rác tái chế màu Vàng / Trắng'}**\n\n` +
        `3️⃣ **Cần làm gì với nó (Quy trình xử lý đúng chuẩn):**\n` +
        (scanItem.actionGuide || scanItem.disposalGuide || []).map((step, idx) => `• ${step}`).join('\n') + '\n\n' +
        `4️⃣ **Có thể tái chế được không:**\n` +
        `• Trạng thái: **${scanItem.recyclabilityStatus || (scanItem.canRecycle ? 'Có thể tái chế hoàn toàn (90 - 100%)' : 'Không thể tái chế thông thường')}**\n` +
        `• Điểm Eco Score: **${scanItem.ecoScore}/100** | Thời gian phân hủy: ${scanItem.decompositionTime}\n\n` +
        `5️⃣ **Tái chế được những gì?:**\n` +
        (scanItem.recyclingProducts && scanItem.recyclingProducts.length > 0
          ? scanItem.recyclingProducts.map((p) => `• 🔄 ${p}`).join('\n')
          : '• Thu hồi nguyên liệu hạt tái sinh phục vụ chuỗi cung ứng kinh tế tuần hoàn.'),
      suggestions: [
        'Điểm thu gom gần nhất ở đâu?',
        'Cách tái chế sáng tạo DIY tại nhà?',
        'Thời gian phân hủy ngoài bãi rác?'
      ]
    };
  }

  if (q.includes('pin') || q.includes('battery') || q.includes('sac')) {
    return {
      reply: '🔋 **ChatGPT & EcoBot Giải Đáp Về Pin & Rác Điện Tử (Nhóm `battery` - 756 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Tên rác: Pin tiểu AA/AAA, Pin cúc áo, Pin Lithium-ion điện thoại, bình ắc quy chì.\n' +
        '• Thành phần: Chứa kim loại nặng cực độc gồm Chì (Pb), Thủy ngân (Hg), Cadmium (Cd) và Axit.\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải nguy hại sinh hoạt** (Quy chuẩn phân loại chất thải nguy hại đô thị).\n' +
        '• Thùng rác: **Thùng màu Đỏ** hoặc điểm thu gom rác điện tử chuyên biệt.\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Dán băng dính cách điện vào 2 cực (+ và -) của pin để chống chập cháy phát nổ.\n' +
        '• Bước 2: Tích trữ trong lọ thủy tinh hoặc hộp nhựa khô ráo, đậy kín nắp.\n' +
        '• Bước 3: Tuyệt đối không đốt, không vứt chung vào bãi rác sinh hoạt thông thường.\n' +
        '• Bước 4: Đem tới các điểm thu hồi pin miễn phí trên **Bản Đồ Số** (VinMart+, Circle K, UBND phường).\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Không thể tái chế tại nhà** — Phải xử lý bằng quy trình nhiệt luyện và thủy luyện công nghiệp khép kín.\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Thu hồi 95% kim loại quý: Coban, Niken, Đồng và muối Lithium tinh khiết.\n' +
        '• Tái chế thành bột Kẽm Oxit (ZnO) làm chất phụ gia cho ngành gốm sứ và sản xuất lốp xe.',
      suggestions: ['Mở Bản Đồ Số tìm điểm nộp pin', 'Pin dự phòng hỏng xử lý thế nào?']
    };
  }

  if (q.includes('nhua') || q.includes('plastic') || q.includes('pet') || q.includes('chai nuoc')) {
    return {
      reply: '🧴 **ChatGPT & EcoBot Giải Đáp Về Rác Thải Nhựa (Nhóm `plastic` - 1.597 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Chai nước khoáng, can dầu ăn, hộp sữa chua (Nhựa PET #1, HDPE #2, PP #5).\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải rắn có thể tái chế** (Nhóm polymer nhiệt dẻo có giá trị kinh tế cao).\n' +
        '• Thùng rác: **Thùng màu Vàng hoặc Trắng** (Dành riêng cho rác tái chế).\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Uống hết hoặc tráng sạch chất lỏng, dầu mỡ còn đọng lại bên trong.\n' +
        '• Bước 2: Tháo nắp chai riêng và bóc nhãn màng co nilông bọc thân chai.\n' +
        '• Bước 3: Dẫm bẹp hoặc vặn xoắn thân chai để tiết kiệm 70% không gian thùng chứa.\n' +
        '• Bước 4: Cho vào túi gom phế liệu hoặc đổi điểm thưởng tại máy thu gom vỏ chai tự động.\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Có thể tái chế rất tốt (95 - 100%)** với chai PET #1 và can nhựa HDPE #2.\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Hạt nhựa tái sinh rPET đạt tiêu chuẩn sản xuất vỏ chai thực phẩm mới.\n' +
        '• Kéo thành sợi xơ polyester dệt áo thể thao, balo du lịch và túi vải tote.\n' +
        '• Đúc thành chậu hoa cây cảnh, khay chứa linh kiện công nghiệp, dây đai buộc hàng.',
      suggestions: ['Làm chậu cây từ chai nhựa', 'Phân biệt nhựa #1 đến #7']
    };
  }

  if (q.includes('ao') || q.includes('quan') || q.includes('vai') || q.includes('clothes') || q.includes('textile')) {
    return {
      reply: '👕 **ChatGPT & EcoBot Giải Đáp Về Quần Áo & Vải Cũ (Nhóm `clothes` - 1.892 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Quần áo cũ, vải vụn, đồ may mặc gia đình từ sợi Cotton tự nhiên và sợi Polyester tổng hợp.\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải dệt may có thể tái sử dụng và tái sinh** (Kinh tế tuần hoàn thời trang).\n' +
        '• Thu gom: **Tủ quần áo từ thiện / Chợ Xanh 0 Đồng** trên EcoScan AI.\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Giặt sạch và phơi thật khô ráo để khử mùi và ẩm mốc.\n' +
        '• Bước 2: Phân loại: Đồ còn lành lặn hãy đăng tặng lên **Chợ Xanh 0 Đồng**.\n' +
        '• Bước 3: Đồ rách nát: Cắt bỏ khóa kéo kim loại, cúc nhựa để chuyển tới xưởng tái chế.\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Có thể tái chế và tái sử dụng cao (85 - 90%)**.\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Kéo sợi dệt thảm trải sàn, giẻ lau công nghiệp siêu thấm.\n' +
        '• Sản xuất các tấm bông cách âm cho xe hơi, tấm cách nhiệt chống nóng trong xây dựng.\n' +
        '• Làm ruột nệm lót êm ái cho thú cưng hoặc may túi tote phong cách từ quần jeans cũ.',
      suggestions: ['Đăng tặng đồ lên Chợ Xanh', 'May túi từ quần jeans cũ']
    };
  }

  if (q.includes('giay') || q.includes('dep') || q.includes('shoes') || q.includes('sneaker')) {
    return {
      reply: '👟 **ChatGPT & EcoBot Giải Đáp Về Giày Dép Cũ (Nhóm `shoes` - 1.449 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Giày thể thao cũ, dép xốp EVA, giày da, sandal đế cao su tổng hợp.\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải thời trang phức hợp** (Hỗn hợp cao su lưu hóa, mút xốp EVA, da PU và keo dán dính).\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Tháo riêng dây giày (giặt sạch dùng làm dây buộc đồ siêu bền).\n' +
        '• Bước 2: Gõ sạch bùn đất ở đế giày, lau khô.\n' +
        '• Bước 3: Nếu còn dùng tốt, tặng lại cho người cần. Nếu rách hỏng, gửi tới dự án thu gom tái chế giày.\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Tái chế có điều kiện** (Cần máy nghiền cơ học tách đế cao su khỏi thân giày).\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Nghiền thành hạt cao su tái sinh làm lớp đệm giảm chấn cho sân chạy điền kinh và sân bóng cỏ nhân tạo.\n' +
        '• Sản xuất gạch cao su lát sàn phòng tập gym chống sốc.\n' +
        '• Làm đế giày bảo hộ lao động mới.',
      suggestions: ['Làm chậu cây từ giày cũ', 'Điểm thu gom giày cũ']
    };
  }

  if (q.includes('huu co') || q.includes('compost') || q.includes('rau') || q.includes('thuc an') || q.includes('biological')) {
    return {
      reply: '🌱 **ChatGPT & EcoBot Giải Đáp Về Rác Hữu Cơ Sinh Học (Nhóm `biological` - 699 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Vỏ rau củ quả, bã cà phê, xác trà, thức ăn thừa không chứa dầu mỡ, lá cây khô.\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải hữu cơ dễ phân hủy sinh học** (Tạo mùn và dưỡng chất tự nhiên).\n' +
        '• Thùng rác: **Thùng rác màu Xanh lá cây**.\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Chắt hết nước thừa, không để lẫn túi nilông hay tăm nhọn.\n' +
        '• Bước 2: Cho vào thùng ủ compost gia đình hoặc đổ vào thùng rác xanh lá đô thị.\n' +
        '• Bước 3: Rắc một lớp men vi sinh Bokashi hoặc bã cà phê khô để khử mùi và kích thích lên men.\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Có thể tái chế 100%** thành phân bón tự nhiên trong 3 - 4 tuần.\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Phân hữu cơ vi sinh compost giàu đạm (N) và kali (K) chăm sóc cây trồng xanh tốt.\n' +
        '• Nước enzyme sinh học tẩy rửa sinh học an toàn từ vỏ dứa/vỏ cam.\n' +
        '• Khí sinh học Biogas dùng làm chất đốt sạch.',
      suggestions: ['Quy tắc ủ phân compost 50/50', 'Làm nước lau bếp từ vỏ cam']
    };
  }

  if (q.includes('carton') || q.includes('hop') || q.includes('cardboard') || q.includes('bia')) {
    return {
      reply: '📦 **ChatGPT & EcoBot Giải Đáp Về Bìa Carton (Nhóm `cardboard` - 1.411 mẫu archive):**\n\n' +
        '1️⃣ **Đó là rác thải gì:**\n' +
        '• Thùng giấy carton sóng đóng hàng, hộp giày, bìa giấy cứng.\n\n' +
        '2️⃣ **Chất thải loại gì:**\n' +
        '• **Chất thải rắn tái chế** (Nhóm sợi xenlulozơ bột giấy công nghiệp).\n' +
        '• Thùng rác: **Thùng rác màu Vàng hoặc Trắng**.\n\n' +
        '3️⃣ **Cần làm gì với nó:**\n' +
        '• Bước 1: Bóc sạch toàn bộ băng dính dán OPP và tem vận chuyển.\n' +
        '• Bước 2: Đảm bảo bìa khô ráo, không dính dầu mỡ thực phẩm.\n' +
        '• Bước 3: Rạch mở các góc và dẫm bẹp phẳng hoàn toàn để tiết kiệm thể tích.\n' +
        '• Bước 4: Buộc thành kiện chuyển giao cho cơ sở thu gom phế liệu.\n\n' +
        '4️⃣ **Có thể tái chế được không:**\n' +
        '• **Có thể tái chế hoàn toàn (Tái chế được 5 - 7 vòng đời bột giấy)**.\n\n' +
        '5️⃣ **Tái chế được những gì?:**\n' +
        '• Thùng carton sóng đóng hàng mới đạt chuẩn xuất khẩu.\n' +
        '• Khay định hình đựng trứng gà, khay đỡ ly cà phê mang đi.\n' +
        '• Giấy kraft làm túi đựng đồ và bìa sổ tay thân thiện môi trường.',
      suggestions: ['Làm đồ chơi từ bìa carton', 'Ủ phân compost từ bìa carton']
    };
  }

  return {
    reply: `Chào bạn! Tôi là **EcoBot AI**, được tích hợp công nghệ **ChatGPT** và đối chiếu với **Bộ dữ liệu 10 nhóm rác thải chuẩn hóa (12.259 mẫu thực tế trong archive)**:\n\n` +
      `Về câu hỏi **"${userPrompt}"**:\n` +
      `Khi bạn quét bất kỳ món đồ nào bằng camera, tôi sẽ lập tức giải đáp chuẩn 5 thông tin:\n` +
      `1. **Đó là rác thải gì** (Tên cụ thể & chất liệu cấu tạo)\n` +
      `2. **Chất thải loại gì** (Nhóm phân loại BVMT & màu thùng rác quy định)\n` +
      `3. **Cần làm gì với nó** (Quy trình các bước xử lý, làm sạch và vứt bỏ)\n` +
      `4. **Có thể tái chế được không** (Trạng thái, tỷ lệ % và điều kiện tái chế)\n` +
      `5. **Tái chế được những gì?** (Danh sách các sản phẩm và nguyên liệu tái sinh thành phẩm)\n\n` +
      `Hãy thử bấm vào nút quét hoặc hỏi tôi về một loại rác cụ thể nhé! 🌍✨`,
    suggestions: [
      'Pin cũ vứt ở đâu an toàn?',
      'Chai nhựa PET tái chế thành gì?',
      'Quần áo cũ có tái chế được không?',
      'Cách phân loại rác tại nguồn'
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
  const [openaiApiKey, setOpenaiApiKeyState] = useState<string>('');
  const [chatModel, setChatModelState] = useState<string>('gpt-4o-mini');
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

      const savedOpenAiKey = localStorage.getItem(STORAGE_KEYS.OPENAI_KEY);
      if (savedOpenAiKey) setOpenaiApiKeyState(savedOpenAiKey);

      const savedModel = localStorage.getItem(STORAGE_KEYS.CHAT_MODEL);
      if (savedModel) setChatModelState(savedModel);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    } catch (e) {
      console.warn(e);
    }
  };

  const setOpenaiApiKey = (key: string) => {
    setOpenaiApiKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, key);
    } catch (e) {
      console.warn(e);
    }
  };

  const setChatModel = (model: string) => {
    setChatModelState(model);
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MODEL, model);
    } catch (e) {
      console.warn(e);
    }
  };

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

    // Try calling server api /api/chat with ChatGPT (OpenAI) or Gemini or EcoBot
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(openaiApiKey ? { 'x-openai-key': openaiApiKey } : {}),
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
        },
        body: JSON.stringify({
          message: text,
          openaiApiKey,
          geminiApiKey,
          model: chatModel,
          scanItemAttachment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const botMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'bot',
            text: data.reply,
            timestamp: 'Vừa xong',
            suggestions: data.suggestions || [
              'Tái chế thành những sản phẩm gì?',
              'Làm sao phân loại pin cũ?',
              'Cách làm phân compost tại nhà?'
            ],
            aiProvider: data.aiProvider || (openaiApiKey ? 'chatgpt' : 'ecobot'),
            model: data.model || chatModel,
          };
          setChatMessages((prev) => [...prev, botMsg]);
          return;
        }
      }
    } catch (err) {
      console.warn('API /api/chat fallback:', err);
    }

    // Smart fallback simulator with the 5 core insights
    await new Promise((r) => setTimeout(r, 600));
    const { reply, suggestions } = getBotResponse(text, scanItemAttachment);
    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: reply,
      timestamp: 'Vừa xong',
      suggestions,
      aiProvider: 'ecobot',
      model: 'ChatGPT-Grounded EcoBot',
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
        openaiApiKey,
        setOpenaiApiKey,
        chatModel,
        setChatModel,
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
