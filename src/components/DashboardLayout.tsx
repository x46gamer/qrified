
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from './ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden p-4 display-contents" style={{ display: 'contents' }} > 
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
