
import React from 'react';
import { cn } from "@/lib/utils";
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
}

const AppLayout = ({ children, showHeader = true, className }: AppLayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {showHeader && <Header />}
      <div className={cn("container mx-auto py-6 px-4", className)}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
