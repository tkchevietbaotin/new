'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ScanResult, Post, Challenge, Comment } from '@/types';
import {
  CURRENT_USER,
  SAMPLE_USERS,
  INITIAL_SCANS,
  INITIAL_POSTS,
  INITIAL_CHALLENGES,
} from './sample-data';

interface EcoStoreContextType {
  user: User | null;
  users: User[];
  scans: ScanResult[];
  posts: Post[];
  challenges: Challenge[];
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
}

const EcoStoreContext = createContext<EcoStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'ecoscan_user',
  SCANS: 'ecoscan_scans',
  POSTS: 'ecoscan_posts',
  CHALLENGES: 'ecoscan_challenges',
  API_KEY: 'ecoscan_gemini_key',
};

export function EcoStoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [scans, setScans] = useState<ScanResult[]>(INITIAL_SCANS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage after mount
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

    // Update current user points & co2
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
        greenPoints: user.greenPoints + 30, // reward 30 points for posting
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

  return (
    <EcoStoreContext.Provider
      value={{
        user,
        users,
        scans,
        posts,
        challenges,
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
