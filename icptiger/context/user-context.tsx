"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  importStatus: {
    remainingImports: number;
  } | null;
  setImportStatus: (status: { remainingImports: number } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  user: User | null;
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  const [importStatus, setImportStatus] = useState<{ remainingImports: number } | null>(null);

  return (
    <UserContext.Provider value={{ user, importStatus, setImportStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}