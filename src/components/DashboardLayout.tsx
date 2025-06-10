import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar, SidebarProvider } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { state } = useSidebar();
  const isOpen = state === 'expanded';
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <Sidebar />
          <main className={cn(
            "flex-1 overflow-x-hidden p-4 transition-all duration-300 ease-in-out",
            !isMobile && (isOpen ? "ml-72" : "ml-20")
          )}> 
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
