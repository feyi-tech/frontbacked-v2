// hooks/useGithub.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { githubConfig } from "../lib/BackendProvider";
import { User } from "firebase/auth";
import { doc, Firestore, getDoc } from "firebase/firestore";
import { API_BASE_URL } from "../app-config";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  owner: { login: string };
}

interface UseGithubResult {
  token: string | null;
  repos: Repo[];
  page: number;
  isLoading: boolean;
  error: string | null;
  githubConnected: boolean;
  connect: () => void;
  nextPage: () => void;
  prevPage: () => void;
  selectRepo: (repo: Repo) => Promise<void>;
}

export function useGithub(user?: User | null, firestore?: Firestore): UseGithubResult {
  const [token, setToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubConnected, setGithubConnected] = useState<boolean>(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !firestore) return;
    const run = async () => {
        setIsLoading(true);
        const docRef = doc(firestore, "github_tokens", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const githubAccessToken = docSnap.data().token;
            setStoredToken(githubAccessToken);
        } else {
            setStoredToken(null);
        }
        setIsLoading(false);
    };
    run();
  }, [user, firestore])

  // Start OAuth flow
  const connect = useCallback(() => {
    if (!user) return;
    const redirectUri = window.location.origin + window.location.pathname;
    const url = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${githubConfig.scope}`;
    window.location.href = url;
  }, [user]);

  // Exchange GitHub "code" for token via API route
  const exchangeCodeForToken = useCallback(async (code: string) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/github/callback`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
        },
        
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error("Failed to exchange code for token");
      const data = await res.json();
      localStorage.setItem("githubAccessToken", data.access_token);
      setToken(data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch repositories
  const fetchRepos = useCallback(
    async (page: number) => {
      if (!token || !user) return;
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/github/repos?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'X-Github-Token': `${token}`
            }
        });

        if (!res.ok) throw new Error(`Failed to fetch repos (${res.status})`);
        const data = await res.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token, user]
  );

  // Select repo (deploy)
  const selectRepo = useCallback(
    async (repo: Repo) => {
      if (!token || !user) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/github/deploy`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`,
            'X-Github-Token': `${token}`
          },
          body: JSON.stringify({
            repoOwner: repo.owner.login,
            repoName: repo.name,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Deployment failed");
        }
        alert(`✅ Theme deployed from ${repo.full_name}`);
      } catch (err: any) {
        alert(`❌ ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [token, user]
  );

  // Pagination helpers
  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  // On mount: check URL params or databased saved token.
  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        setGithubConnected(true);
        exchangeCodeForToken(code).then(() => {
            // clean up query param
            window.history.replaceState({}, "", window.location.pathname);
        });
    } else if (storedToken) {
        setGithubConnected(true);
        setToken(storedToken);
    }
  }, [exchangeCodeForToken, user, storedToken]);

  // Refetch repos when page or token changes
  useEffect(() => {
    if (token && user) fetchRepos(page);
  }, [page, token, user, fetchRepos]);

  return {
    token,
    repos,
    page,
    isLoading,
    error,
    githubConnected,
    connect,
    nextPage,
    prevPage,
    selectRepo,
  };
}