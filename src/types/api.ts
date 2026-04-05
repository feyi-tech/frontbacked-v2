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
  ownerId: string;
  createdAt: string;
  likes?: number;
  usageCount?: number;
  price?: number;
  author?: {
    id: string;
    name: string;
    username: string;
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

export interface SiteSettings {
  name: string;
  description?: string;
  [x: string]: any
}


export interface Site {
  id: string;
  name: string;
  description?: string;
  subdomain: string;
  themeId: string;
  themePlan: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'purchased';
  themeVersionId: string;
  ownerId: string;
  settings: SiteSettings;
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
  githubRepoId: string;
  fullName: string;
  installationId: string;
  ownerLogin: string;
  defaultBranch: string;
  lastActivityAt: string | null;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
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
