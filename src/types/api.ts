export interface User {
  id: string;
  email: string;
  name?: string;
  currency?: string;
  emailVerified: boolean;
  githubInstallationId: string | null;
  githubInstallationStatus: 'pending' | 'completed' | 'failed' | null;
  githubSyncStatus: 'none' | 'syncing' | 'completed' | 'failed' | null;
  totalThemes: number;
  totalRepos: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  creatorId: string;
  createdAt: string;
  likes?: number;
  usageCount?: number;
  price?: number;
  creator?: {
    name: string;
    photo?: string;
  };
  category?: string;
  subcategory?: string;
  pricing?: {
    monthly: number;
    quarterly: number;
    yearly: number;
    purchase: number;
  };
}

export interface ThemeVersion {
  id: string;
  themeId: string;
  version: string;
  createdAt: string;
}

export interface Site {
  id: string;
  name: string;
  subdomain: string;
  themeId: string;
  themeVersionId: string;
  ownerId: string;
  createdAt: string;
}

export interface Domain {
  id: string;
  siteId: string;
  hostname: string;
  verified: boolean;
  verificationToken: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  owner: { login: string };
}

export type WSEventType = 'user.updated' | 'github.sync.completed' | 'github.sync.failed';

export interface WSEvent<T = any> {
  type: WSEventType;
  data: T;
  meta: {
    timestamp: number;
    version: number;
  };
}
