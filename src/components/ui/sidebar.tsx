
import React, { createContext, useState, useContext, ReactNode } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
});

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
