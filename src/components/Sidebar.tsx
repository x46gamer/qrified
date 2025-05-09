import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, Brush, Settings, Users, ChevronRight, ChevronLeft, Globe, LineChart, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
interface SidebarProps {
  className?: string;
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
  const {
    user
  } = useAuth();
  const isAdmin = user?.role === 'admin';
  return <div className={cn('flex flex-col h-full bg-white border-r transition-all duration-300', isOpen ? 'w-64' : 'w-[70px]', className)}>
      <div className="flex-1 overflow-y-auto py-6">
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
        }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", location.pathname === "/dashboard" && !location.search.includes("tab=") ? "bg-blue-50 text-blue-600" : "", location.search.includes("tab=generate") ? "bg-blue-50 text-blue-600" : "", !isActive ? "text-gray-700 hover:bg-gray-100" : "")}>
            <QrCode size={20} className="shrink-0" />
            <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
              Generate QR
            </span>
          </NavLink>

          {isAdmin && <NavLink to="/dashboard?tab=manage" className={({
          isActive
        }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", location.search.includes("tab=manage") ? "bg-blue-50 text-blue-600" : "", !isActive || !location.search.includes("tab=manage") ? "text-gray-700 hover:bg-gray-100" : "")}>
              <Users size={20} className="shrink-0" />
              <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
                Manage QR
              </span>
            </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=analytics" className={({
          isActive
        }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", location.search.includes("tab=analytics") ? "bg-blue-50 text-blue-600" : "", !isActive || !location.search.includes("tab=analytics") ? "text-gray-700 hover:bg-gray-100" : "")}>
              <LineChart size={20} className="shrink-0" />
              <span className={cn("ml-3 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>
                Analytics
              </span>
            </NavLink>}

          {isAdmin && <NavLink to="/dashboard?tab=customize" className={({
          isActive
        }) => cn("flex items-center py-2 px-3 rounded-lg text-sm", location.search.includes("tab=customize") ? "bg-blue-50 text-blue-600" : "", !isActive || !location.search.includes("tab=customize") ? "text-gray-700 hover:bg-gray-100" : "")}>
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
        </nav>
      </div>

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
    </div>;
};
export default Sidebar;