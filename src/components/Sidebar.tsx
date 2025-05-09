
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  QrCode, 
  BarChart3, 
  Palette, 
  ChevronRight, 
  ChevronDown,
  Users,
  LogOut,
  Menu,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Sidebar as SidebarComponent, SidebarContent, useSidebar } from './ui/sidebar';

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
  const [expanded, setExpanded] = React.useState(false);
  const { state } = useSidebar();
  
  const hasSubItems = subItems && subItems.length > 0;
  
  const toggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setExpanded(!expanded);
    }
    if (onClick) onClick();
  };

  const isCollapsed = state === "collapsed";

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
        {!isCollapsed && <span className="flex-grow font-medium">{label}</span>}
        {hasSubItems && !isCollapsed && (
          expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        )}
      </Link>
      
      {hasSubItems && expanded && !isCollapsed && (
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
  const { profile, logout } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { state, toggleSidebar } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isDashboardTabActive = (tab: string) => {
    return location.pathname === '/dashboard' && location.search.includes(`tab=${tab}`);
  };

  return (
    <SidebarComponent>
      <SidebarContent className="pt-6 px-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="mb-4 ml-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href="/dashboard" 
            active={isActive('/dashboard') && !location.search.includes('tab=')}
          />
          
          <SidebarItem 
            icon={QrCode} 
            label="QR Codes" 
            href="/dashboard?tab=generate" 
            subItems={[
              { label: 'Generate', href: '/dashboard?tab=generate' },
              { label: 'Manage', href: '/dashboard?tab=manage' },
            ]}
            active={isDashboardTabActive('generate') || isDashboardTabActive('manage')}
          />
          
          {isAdmin && (
            <>
              <SidebarItem 
                icon={Palette} 
                label="Appearance" 
                href="/dashboard?tab=customize" 
                active={isDashboardTabActive('customize')}
              />
            
              <SidebarItem 
                icon={BarChart3} 
                label="Analytics" 
                href="/dashboard?tab=analytics" 
                active={isDashboardTabActive('analytics')}
              />

              <SidebarItem 
                icon={Users} 
                label="Team" 
                href="/settings?section=team" 
                active={location.pathname === '/settings' && location.search.includes('section=team')}
              />
              
              <SidebarItem 
                icon={Globe} 
                label="Domains" 
                href="/settings?section=domains" 
                active={location.pathname === '/settings' && location.search.includes('section=domains')}
              />
            </>
          )}
          
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            href="/settings" 
            subItems={[
              { label: 'General', href: '/settings?section=general' },
              { label: 'Help', href: '/settings?section=help' },
            ]}
            active={location.pathname === '/settings' && !location.search.includes('section=team') && !location.search.includes('section=domains')}
          />
          
          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 rounded-md transition-all text-gray-700 hover:text-red-600 hover:bg-white/60",
                state === "collapsed" ? "justify-center" : "justify-start"
              )}
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              {state !== "collapsed" && <span>Log out</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
