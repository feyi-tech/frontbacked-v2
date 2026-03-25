import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, WSEvent } from "../types/api";
import { authApi } from "../api/auth";
import { useRouter } from "next/router";
import { useToast } from '@/hooks/use-toast';
import Swal from "sweetalert2";
import { wsManager } from "../lib/websocket";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  logOutAlert: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (storedToken) {
      setToken(storedToken);
      authApi.me()
        .then(res => {
          setUser(res.user);
          wsManager.connect();
        })
        .catch(() => {
          localStorage.removeItem("auth_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      wsManager.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const unsubscribeUserUpdated = wsManager.subscribe("user.updated", (event: WSEvent<User>) => {
      console.log("websocket => user.updated", event)
      setUser(event.data);
    });

    const unsubscribeSyncOk = wsManager.subscribe("github.sync.completed", (event: WSEvent) => {
      console.log("websocket => github.sync.completed", event)
      toast({
        title: "GitHub Sync Successful",
        description: "There was an error syncing your GitHub repositories. Please try again.",
        variant: "destructive",
      });
    });

    const unsubscribeSyncFailed = wsManager.subscribe("github.sync.failed", (event: WSEvent) => {
      console.log("websocket => github.sync.failed", event)
      toast({
        title: "GitHub Sync Failed",
        description: "There was an error syncing your GitHub repositories. Please try again.",
        variant: "destructive",
      });
    });

    return () => {
      unsubscribeUserUpdated();
      unsubscribeSyncOk();
      unsubscribeSyncFailed();
    };
  }, [token, toast]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("auth_token", res.token);
      wsManager.connect();
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("auth_token", res.token);
      wsManager.connect();
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    wsManager.disconnect();
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const logOutAlert = () => {
    Swal.fire({
      title: 'Are you sure you want to sign out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign out!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out",
        });
      } 
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, logOutAlert }}>
      {children}
    </AuthContext.Provider>
  );
};
