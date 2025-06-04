
import React from 'react';
import { SidebarProvider } from './ui/sidebar';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
