import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/api";
import { authApi } from "../api/auth";
import { useRouter } from "next/router";
import { useToast } from '@/hooks/use-toast';
import Swal from "sweetalert2";

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
        })
        .catch(() => {
          localStorage.removeItem("auth_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("auth_token", res.token);
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
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
