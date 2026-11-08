export type WasteCategory =
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'glass'
  | 'organic'
  | 'electronic'
  | 'hazardous'
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
