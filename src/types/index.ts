export type WasteCategory =
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'glass'
  | 'organic'
  | 'electronic'
  | 'hazardous'
  | 'cardboard'
  | 'clothes'
  | 'shoes'
  | 'trash'
  | 'other';

export type RecyclabilityLevel = 'high' | 'medium' | 'low' | 'non-recyclable';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  greenPoints: number;
  ecoRank: number;
  rankTitle: string;
  bio: string;
  badges: Badge[];
  scanCount: number;
  co2SavedKg: number;
  joinedDate: string;
}

export interface BoundingBox {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [top, left, width, height] in percentages
  color: string;
}

export interface MaterialBreakdown {
  name: string;
  percentage: number;
  recyclable: boolean;
  color: string;
}

export interface DatasetReferenceMatch {
  categoryKey: string;
  categoryNameVi: string;
  totalDatasetSamples: number;
  matchScore: number;
  sampleImages: Array<{
    fileName: string;
    imageUrl: string;
  }>;
}

export interface ScanResult {
  id: string;
  itemName: string; // 1. Đó là rác thải gì
  wasteName?: string; // Tên cụ thể mở rộng
  category: WasteCategory;
  categoryNameVi: string; // Tên danh mục tiếng Việt
  wasteClassification?: string; // 2. Chất thải loại gì (theo chuẩn phân loại BVMT)
  wasteBinColor?: string; // Màu thùng rác tương ứng (Vàng/Trắng: Tái chế, Xanh lá: Hữu cơ, Đỏ: Nguy hại, Cam/Xám: Rác còn lại)
  materialType: string;
  recyclability: RecyclabilityLevel;
  canRecycle?: boolean; // 4. Có thể tái chế được không (true/false)
  recyclabilityStatus?: string; // Mô tả trạng thái tái chế (e.g. "Có thể tái chế hoàn toàn (95 - 100%)")
  recyclingProducts?: string[]; // 5. Tái chế được những gì? (Danh sách sản phẩm thành phẩm tái sinh)
  actionGuide?: string[]; // 3. Cần làm gì với nó (các bước hành động xử lý cụ thể)
  ecoScore: number; // 0 to 100
  co2SavedKg: number;
  decompositionTime: string;
  disposalGuide: string[]; // Tương thích ngược với actionGuide
  upcyclingTips: string[];
  confidence: number;
  imageUrl: string;
  timestamp: string;
  scannedBy?: string;
  boundingBoxes?: BoundingBox[];
  materialBreakdowns?: MaterialBreakdown[];
  datasetMatch?: DatasetReferenceMatch;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    rankTitle?: string;
  };
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    rankTitle: string;
  };
  content: string;
  imageUrl?: string;
  scanItemName?: string;
  scanResultId?: string;
  tags: string[];
  likes: string[]; // list of user ids who liked
  comments: Comment[];
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  category: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: string;
  expiresIn: string;
}

// Chatbot types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  imageAttachment?: string;
  suggestions?: string[];
  scanItemAttachment?: ScanResult;
  datasetContextReference?: string;
  aiProvider?: 'chatgpt' | 'gemini' | 'ecobot';
  model?: string;
  chatGptWebUrl?: string;
}

// Digital Eco Map types
export type LocationCategory =
  | 'battery_ewaste'
  | 'recycling_center'
  | 'refill_station'
  | 'public_bin';

export interface EcoLocation {
  id: string;
  name: string;
  category: LocationCategory;
  categoryNameVi: string;
  address: string;
  city: string;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
  acceptedMaterials: string[];
  openingHours: string;
  phone: string;
  verified: boolean;
  rewardPointsBonus: number;
}

// Environmental Alerts & Hazards
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'in_progress' | 'resolved';

export interface EcoAlert {
  id: string;
  title: string;
  description: string;
  type: 'aqi_warning' | 'waste_hotspot' | 'illegal_dumping' | 'clean_campaign';
  severity: AlertSeverity;
  status: AlertStatus;
  location: string;
  reportedBy: string;
  reportedAt: string;
  imageUrl?: string;
  upvotes: number;
  volunteersJoined: number;
}

// Marketplace & Event types for Community
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'Mới 100%' | 'Như mới (95%)' | 'Đã qua sử dụng';
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  imageUrl: string;
  location: string;
  isFree: boolean;
  greenPointsPrice?: number;
  status: 'available' | 'claimed';
  createdAt: string;
}

export interface GreenEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  participantsCount: number;
  maxParticipants: number;
  rewardPoints: number;
  imageUrl: string;
  isJoined: boolean;
}

// Dataset Archive Explorer types
export interface DatasetCategoryInfo {
  key: string;
  nameVi: string;
  icon: string;
  count256: number;
  count384: number;
  description: string;
  color: string;
  sampleFiles: string[];
}

export interface DatasetStats {
  totalImages: number;
  categoriesCount: number;
  resolution: string;
  categories: DatasetCategoryInfo[];
}
