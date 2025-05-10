
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, Brush, Settings, Users, Globe, LineChart, MessageSquare, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SidebarProps {
  className?: string;
}

interface UserLimits {
  qr_limit: number;
  qr_created: number;
  qr_successful: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  className
}) => {
  const {
    state,
    toggleSidebar
  } = useSidebar();
  
  const isOpen = state === 'expanded';
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserLimits();
    }
  }, [user?.id]);
  
  const fetchUserLimits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_limits')
        .select('qr_limit, qr_created, qr_successful')
        .eq('id', user?.id)
        .single();
        
      if (error) {
        console.error('Error fetching user limits:', error);
        return;
      }
      
      setUserLimits(data);
    } catch (err) {
      console.error('Error in fetch user limits:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  const remainingQrCodes = userLimits ? userLimits.qr_limit - userLimits.qr_created : 0;
  const qrCodePercentage = userLimits ? (userLimits.qr_created / userLimits.qr_limit) * 100 : 0;
  
  return (
    <div className={cn('flex flex-col h-full bg-white border-r transition-all duration-300', isOpen ? 'w-64' : 'w-[70px]', className)}>
      <div className="flex-1 overflow-y-clip py-6">
        <div className="flex items-center justify-between px-3 mb-8">
          <div className="flex items-center">
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl")}>
              S
            </div>
            <span className={cn("ml-3 text-xl font-semibold tracking-tight transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              SeQRity
            </span>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink to="/dashboard" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100")}>
            <LayoutDashboard size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Dashboard
            </span>
          </NavLink>

          <NavLink to="/dashboard?tab=generate" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", 
            location.pathname === "/dashboard" && !location.search.includes("tab=") ? "bg-blue-50 text-blue-600" : "", 
            location.search.includes("tab=generate") ? "bg-blue-50 text-blue-600" : "", 
            !isActive ? "text-gray-700 hover:bg-gray-100" : "")}>
            <QrCode size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Generate QR
            </span>
          </NavLink>

          {isAdmin && <NavLink to="/dashboard?tab=manage" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", 
            location.search.includes("tab=manage") ? "bg-blue-50 text-blue-600" : "", 
            !isActive || !location.search.includes("tab=manage") ? "text-gray-700 hover:bg-gray-100" : "")}>
            <Users size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Manage QR
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=analytics" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", 
            location.search.includes("tab=analytics") ? "bg-blue-50 text-blue-600" : "", 
            !isActive || !location.search.includes("tab=analytics") ? "text-gray-700 hover:bg-gray-100" : "")}>
            <LineChart size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Analytics
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=customize" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", 
            location.search.includes("tab=customize") ? "bg-blue-50 text-blue-600" : "", 
            !isActive || !location.search.includes("tab=customize") ? "text-gray-700 hover:bg-gray-100" : "")}>
            <Brush size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Customize
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/domains" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100")}>
            <Globe size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Domains
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/feedback" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100")}>
            <MessageSquare size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Feedback
            </span>
          </NavLink>}

          <NavLink to="/settings" className={({
            isActive
          }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100")}>
            <Settings size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Settings
            </span>
          </NavLink>

          <button
            onClick={handleLogout}
            className={cn("flex w-full items-center py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100")}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Logout
            </span>
          </button>
        </nav>
      </div>
      
      {/* QR Code Limits */}
      {user && userLimits && (
        <div className={cn("px-3 py-4 border-t", isOpen ? "" : "px-2")}>
          <div className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">QR Codes Monthly</span>
              <span className="text-xs font-medium text-gray-600">{remainingQrCodes}/{userLimits.qr_limit}</span>
            </div>
          </div>
          <Progress value={qrCodePercentage} className={cn("h-2", qrCodePercentage > 80 ? "bg-red-100" : "bg-blue-100")} />
        </div>
      )}
      
      <div className={cn("border-t p-3", isOpen ? "text-left" : "text-center")}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center uppercase text-gray-600 font-medium">
            {user?.email?.charAt(0)}
          </div>
          <div className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
            <p className="text-sm font-medium">{isAdmin ? 'Admin' : 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
