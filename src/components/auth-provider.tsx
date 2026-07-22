"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

interface AuthContextType {
  isClerkEnabled: boolean;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isClerkEnabled: false,
  user: null,
  signOut: () => {},
});

export const useAppAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isClerkEnabled, setIsClerkEnabled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if Clerk publishable key is defined and not a mock key
    const hasKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('dummy');
    setIsClerkEnabled(hasKey);

    if (!hasKey) {
      // Pre-fill mock user in sandbox mode
      setUser({
        name: "Alexander Sterling",
        email: "alexander.sterling@design.io"
      });
    }
  }, []);

  const signOut = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const contextValue = {
    isClerkEnabled,
    user,
    signOut,
  };

  if (isClerkEnabled) {
    return (
      <ClerkProvider>
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      </ClerkProvider>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
