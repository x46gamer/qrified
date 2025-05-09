
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

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

// Export SidebarTrigger component
export const SidebarTrigger: React.FC = () => {
  const { toggleCollapse } = useSidebar();
  
  return (
    <Button variant="ghost" size="icon" onClick={toggleCollapse}>
      <Menu className="h-5 w-5" />
    </Button>
  );
};
