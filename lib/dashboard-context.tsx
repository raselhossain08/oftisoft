"use client";

import React, { createContext, useContext, useState } from "react";

type DashboardContextType = {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <DashboardContext.Provider value={{ mobileSidebarOpen, setMobileSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    return {
      mobileSidebarOpen: false,
      setMobileSidebarOpen: () => {},
    };
  }
  return ctx;
}
