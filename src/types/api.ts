export interface User {
  id: string;
  email: string;
  name?: string;
  currency?: string;
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
