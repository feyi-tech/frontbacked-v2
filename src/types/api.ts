export interface User {
  id: string;
  email: string;
  name?: string;
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
