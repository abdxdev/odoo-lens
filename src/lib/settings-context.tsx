"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SettingsContextType = {
  sessionKey: string | null;
  setSessionKey: (key: string) => void;
  isSessionKeySet: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isSessionKeySet, setIsSessionKeySet] = useState<boolean>(false);

  // Load the session key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("odoo-session-key");
    if (storedKey) {
      setSessionKey(storedKey);
      setIsSessionKeySet(true);
    }
  }, []);

  // Update localStorage and state when session key changes
  const updateSessionKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem("odoo-session-key", key);
      setSessionKey(key);
      setIsSessionKeySet(true);
    } else {
      localStorage.removeItem("odoo-session-key");
      setSessionKey(null);
      setIsSessionKeySet(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ sessionKey, setSessionKey: updateSessionKey, isSessionKeySet }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}