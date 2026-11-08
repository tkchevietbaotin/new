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

export interface ScanResult {
  id: string;
  itemName: string;
  category: WasteCategory;
  categoryNameVi: string;
  materialType: string;
  recyclability: RecyclabilityLevel;
  ecoScore: number; // 0 to 100
  co2SavedKg: number;
  decompositionTime: string;
  disposalGuide: string[];
  upcyclingTips: string[];
  confidence: number;
  imageUrl: string;
  timestamp: string;
  scannedBy?: string;
  boundingBoxes?: BoundingBox[];
  materialBreakdowns?: MaterialBreakdown[];
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
  suggestions?: string[];
  scanItemAttachment?: ScanResult;
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
