"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, usePathname } from "next/navigation";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPXNTzV8DY81zW9YufL2cj8annlIqFEvY",
  authDomain: "paybulous.firebaseapp.com",
  projectId: "paybulous",
  storageBucket: "paybulous.firebasestorage.app",
  messagingSenderId: "629887426598",
  appId: "1:629887426598:web:6ab43fd245238b79db46e7",
  measurementId: "G-306TRERQ7B",
};

// GitHub config
export const githubConfig = {
  clientId: "Ov23liwlcly035s7yOx2",
  scope: "repo",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Auth paths
const AUTH_START_PATHS = ["/dashboard"]; // adjust to your needs
const EXCEPTIONS_PATHS = ["/dashboard/create-site"]; // adjust to your needs

// Context shape
interface BackendContextType {
  user: User | null | undefined; // null = signed out, undefined = still loading
  isAuthenticating: boolean;
  auth: ReturnType<typeof getAuth>;
  firestore: ReturnType<typeof getFirestore>;
  githubConfig: typeof githubConfig;
  signOutUser: () => Promise<void>;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

// Provider
export const BackendProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect logic
  useEffect(() => {
    if (!loading && !user) {
      const shouldRedirect =
        AUTH_START_PATHS.some((p) => pathname.startsWith(p)) &&
        !EXCEPTIONS_PATHS.includes(pathname);

      if (shouldRedirect) {
        router.push("/sign-in");
      }
    }
  }, [user, loading, pathname, router]);

  const value: BackendContextType = {
    user,
    isAuthenticating: loading,
    auth,
    firestore,
    githubConfig,
    signOutUser: () => signOut(auth),
  };

  return (
    <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
  );
};

// Hook
export const useBackend = () => {
  const ctx = useContext(BackendContext);
  if (!ctx) {
    throw new Error("useBackend must be used inside BackendProvider");
  }
  return ctx;
};