import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, Brush, Settings, Users, Globe, LineChart, MessageSquare, ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

interface UserLimits {
  qr_limit: number;
  qr_created: number;
  qr_successful: number;
  monthly_qr_limit: number;
  monthly_qr_created: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  className
}) => {
  const {
    state,
    toggleSidebar,
    openMobile,
    setOpenMobile
  } = useSidebar();
  
  const isOpen = state === 'expanded';
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (user?.id) {
      fetchUserLimits();
    }
  }, [user?.id]);
  
  const fetchUserLimits = async () => {
    try {
      const { data, error: userLimitError } = await supabase
        .from('user_limits')
        .select('qr_limit, qr_created, qr_successful, monthly_qr_limit, monthly_qr_created')
        .eq('id', user?.id)
        .single();
        
      if (userLimitError) {
        console.error('Error fetching user limits:', userLimitError.message);
        // Set to default zeros on error
        setUserLimits({
          qr_limit: 0,
          qr_created: 0,
          qr_successful: 0,
          monthly_qr_limit: 0,
          monthly_qr_created: 0
        });
        // Do not proceed further if there's an error
        return;
      }
      
      // If no error, data should be of the expected type or null if no row found (depending on Supabase version/config)
      // Let's assume if no error, and data exists, it matches UserLimits structure
      if (data) {
        const limitsData: UserLimits = {
            qr_limit: data.qr_limit || 0,
            qr_created: data.qr_created || 0,
            qr_successful: data.qr_successful || 0,
            monthly_qr_limit: data.monthly_qr_limit || 0,
            monthly_qr_created: data.monthly_qr_created || 0,
        };
        setUserLimits(limitsData);
      } else {
          // Data is null - user might not have a limits entry yet or no row found (PGRST116 handled by single() not returning error)
          console.log('No user limits data found for user:', user?.id);
          setUserLimits({ 
            qr_limit: 0,
            qr_created: 0,
            qr_successful: 0,
            monthly_qr_limit: 0,
            monthly_qr_created: 0
          });
      }

    } catch (err) {
      console.error('Error in fetch user limits:', err);
      // Set to default zeros on error
      setUserLimits({ 
        qr_limit: 0,
        qr_created: 0,
        qr_successful: 0,
        monthly_qr_limit: 0,
        monthly_qr_created: 0
      });
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
  
  // Updated calculations for monthly limits
  const monthlyQrCreatedCount = userLimits ? userLimits.monthly_qr_created : 0;
  const monthlyQrLimitCount = userLimits ? userLimits.monthly_qr_limit : 0;
  const monthlyQrPercentage = monthlyQrLimitCount > 0 ? (monthlyQrCreatedCount / monthlyQrLimitCount) * 100 : (monthlyQrCreatedCount > 0 ? 100 : 0);
  
  // If on mobile and sidebar is closed, render narrow sidebar with icons only
  if (isMobile && !openMobile) {
    return null;
  }
  
  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r transition-all duration-300 ease-in-out',
      isOpen ? 'w-72' : 'w-20 items-center',
      isMobile && 'fixed left-0 top-0 h-full z-40',
      className
    )}>
      {isMobile && (
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            className="md:hidden"
          >
            <X size={20} />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto py-6 w-full">
        <div className={cn("flex items-center mb-8", isOpen ? "justify-start px-4" : "justify-center px-0")}>
          <div className="flex items-center">
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl", !isOpen && "mx-auto")}>
              QR
            </div>
            <span className={cn("ml-3 text-xl font-semibold tracking-tight transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              QRified
            </span>
          </div>
        </div>

        <nav className={cn("space-y-1", isOpen ? "px-4" : "px-2")}>
          <NavLink to="/dashboard" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}>
            <LayoutDashboard size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Dashboard
            </span>
          </NavLink>

          <NavLink to="/stats" className={({ isActive }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}> 
            <LineChart size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}> 
              Analytics
            </span>
          </NavLink>

          <NavLink to="/dashboard?tab=generate" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", 
            location.pathname === "/dashboard" && !location.search.includes("tab=") ? "bg-blue-50 text-blue-600" : "", 
            location.search.includes("tab=generate") ? "bg-blue-50 text-blue-600" : "", 
            !isActive && !location.search.includes("tab=generate") ? "text-gray-700 hover:bg-gray-100" : "",
            isOpen ? "px-3" : "px-2 justify-center"
            )}>
            <QrCode size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Generate QR
            </span>
          </NavLink>

          {isAdmin && <NavLink to="/dashboard?tab=manage" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", 
            location.search.includes("tab=manage") ? "bg-blue-50 text-blue-600" : "", 
            !isActive && !location.search.includes("tab=manage") ? "text-gray-700 hover:bg-gray-100" : "",
            isOpen ? "px-3" : "px-2 justify-center"
            )}>
            <Users size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Manage QR
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=analytics" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", 
            location.search.includes("tab=analytics") ? "bg-blue-50 text-blue-600" : "", 
            !isActive && !location.search.includes("tab=analytics") ? "text-gray-700 hover:bg-gray-100" : "",
            isOpen ? "px-3" : "px-2 justify-center"
            )}>
            <LineChart size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Analytics
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/scanlogs" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}>
            <LineChart size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Scan Logs
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=customize" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", 
            location.search.includes("tab=customize") ? "bg-blue-50 text-blue-600" : "", 
            !isActive && !location.search.includes("tab=customize") ? "text-gray-700 hover:bg-gray-100" : "",
            isOpen ? "px-3" : "px-2 justify-center"
            )}>
            <Brush size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Customize
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/domains" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}>
            <Globe size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Domains
            </span>
          </NavLink>}

          {isAdmin && <NavLink to="/feedback" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}>
            <MessageSquare size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Feedback
            </span>
          </NavLink>}

          <NavLink to="/settings" className={({
            isActive
          }) => cn("flex items-center py-2 rounded-lg text-sm transition-colors duration-200", isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100", isOpen ? "px-3" : "px-2 justify-center")}>
            <Settings size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Settings
            </span>
          </NavLink>

          <button
            onClick={handleLogout}
            className={cn("flex w-full items-center py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200", isOpen ? "px-3" : "px-2 justify-center")}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
              Logout
            </span>
          </button>
        </nav>
      </div>
      
      {/* User Info and QR Limits */}
      {user && userLimits && (
        <div className={cn("px-4 py-4 border-t transition-all duration-300", isOpen ? "" : "px-2 text-center")}>
           {/* User Info */}
           <div className={cn("flex items-center mb-3", isOpen ? "justify-start" : "justify-center flex-col")}>
             <div className={cn("w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center uppercase font-medium text-lg", !isOpen && "mb-1")}>
               {user?.email?.charAt(0) || 'U'}
             </div>
             <div className={cn("transition-opacity duration-300", isOpen ? "opacity-100 ml-3" : "opacity-0 hidden")}>
               <div className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</div>
               <div className="text-xs text-gray-600 truncate">{user?.email}</div>
             </div>
              {/* Tooltip for user info when collapsed */}
              {!isOpen && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="">
                       
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</div>
                        <div className="text-xs text-gray-700">{user?.email}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
           </div>

           {/* QR Code Limits */}
           <div className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 hidden")}>
             <div className="flex justify-between items-center mb-1">
               <span className="text-xs font-medium text-gray-600">QR Codes Monthly</span>
               <span className="text-xs font-medium text-gray-600">{monthlyQrCreatedCount}/{monthlyQrLimitCount}</span>
             </div>
             <Progress value={monthlyQrPercentage} className={cn("h-2", monthlyQrPercentage > 80 ? "bg-red-500" : "bg-gray-500", "transition-colors duration-300")} />
           </div>
            {/* Tooltip for QR limits when collapsed */}
            {!isOpen && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                       <Progress value={monthlyQrPercentage} className={cn("h-2", monthlyQrPercentage > 80 ? "bg-red-500" : "bg-gray-500", "transition-colors duration-300")} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>{monthlyQrCreatedCount}/{monthlyQrLimitCount} QR Codes Monthly</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>
      )}

      {/* Sidebar Toggle Button */}
      <div className="absolute bottom-4 right-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full shadow-lg hidden md:flex"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

    </div>
  );
};

export default Sidebar;
