"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/sessionClient";

interface SessionContextProps {
  session: any;
  refreshSession: () => void;
}

const SessionContext = createContext<SessionContextProps>({
  session: null,
  refreshSession: () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);

  const refreshSession = async () => {
    const user = await getCurrentUser();
    setSession(user);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
