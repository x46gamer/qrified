
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from './ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <Sidebar />
          <main className={cn(
            "flex-1 overflow-x-hidden p-4",
            isMobile ? "ml-[60px]" : ""
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
