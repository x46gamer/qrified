
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  QrCode, 
  FileText, 
  BarChart3, 
  Palette, 
  ChevronRight, 
  ChevronDown,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  subItems?: Array<{ label: string; href: string }>;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  active, 
  onClick,
  subItems
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasSubItems = subItems && subItems.length > 0;
  
  const toggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setExpanded(!expanded);
    }
    if (onClick) onClick();
  };

  return (
    <div className="mb-1">
      <Link 
        to={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all",
          active 
            ? "bg-gradient-to-r from-blue-500/90 to-violet-500/90 text-white shadow-md" 
            : "hover:bg-white/60 text-gray-700 hover:text-blue-600",
        )}
        onClick={toggleExpand}
      >
        <Icon className={cn("h-5 w-5", active ? "text-white" : "text-blue-500")} />
        <span className="flex-grow font-medium">{label}</span>
        {hasSubItems && (
          expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        )}
      </Link>
      
      {hasSubItems && expanded && (
        <div className="ml-8 mt-1 space-y-1 border-l-2 border-blue-200 pl-2">
          {subItems.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex items-center py-1.5 px-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/60 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-100 shadow-md h-full overflow-y-auto py-6 px-2">
      <div className="mb-8 text-center">
        <div className="flex justify-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            seQRity
          </h2>
        </div>
        {user && (
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as {user.role}
          </p>
        )}
      </div>
      
      <div className="space-y-1">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          href="/dashboard" 
          active={isActive('/dashboard')}
        />
        
        <SidebarItem 
          icon={QrCode} 
          label="QR Codes" 
          href="#" 
          subItems={[
            { label: 'Generate', href: '/dashboard?tab=generate' },
            { label: 'Manage', href: '/dashboard?tab=manage' },
          ]}
          active={location.pathname === '/dashboard' && (
            location.search.includes('tab=generate') || 
            location.search.includes('tab=manage')
          )}
        />
        
        {isAdmin && (
          <>
            <SidebarItem 
              icon={Palette} 
              label="Appearance" 
              href="/dashboard?tab=customize" 
              active={location.pathname === '/dashboard' && location.search.includes('tab=customize')}
            />
          
            <SidebarItem 
              icon={BarChart3} 
              label="Analytics" 
              href="/dashboard?tab=analytics" 
              active={location.pathname === '/dashboard' && location.search.includes('tab=analytics')}
            />

            <SidebarItem 
              icon={Users} 
              label="Team" 
              href="/dashboard?tab=team" 
              active={location.pathname === '/dashboard' && location.search.includes('tab=team')}
            />
            
            <SidebarItem 
              icon={FileText} 
              label="Feedback" 
              href="/admin/feedback" 
              active={isActive('/admin/feedback')}
            />
          </>
        )}
        
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          href="/dashboard?tab=settings" 
          active={location.pathname === '/dashboard' && location.search.includes('tab=settings')}
        />
      </div>
    </div>
  );
};

export default Sidebar;
