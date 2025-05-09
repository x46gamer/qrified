
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutGrid,
  Settings,
  Users,
  Palette,
  BarChart3,
  Menu,
  Package,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Generate QR',
      href: '/dashboard?tab=generate',
      icon: Package,
      current: location.pathname === '/dashboard' && (!location.search || location.search.includes('tab=generate'))
    },
    ...(isAdmin ? [
      {
        name: 'Manage QR',
        href: '/dashboard?tab=manage',
        icon: Settings,
        current: location.pathname === '/dashboard' && location.search.includes('tab=manage')
      },
      {
        name: 'Analytics',
        href: '/dashboard?tab=analytics',
        icon: BarChart3,
        current: location.pathname === '/dashboard' && location.search.includes('tab=analytics')
      },
      {
        name: 'Team',
        href: '/dashboard?tab=team',
        icon: Users,
        current: location.pathname === '/dashboard' && location.search.includes('tab=team')
      },
      {
        name: 'Customize',
        href: '/customize',
        icon: Palette,
        current: location.pathname === '/customize'
      }
    ] : [])
  ];

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 h-16">
        {!isCollapsed && (
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            seQRity
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="ml-auto">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                item.current ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <item.icon className={cn("h-5 w-5", item.current && "text-blue-600")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          onClick={logout}
          className={cn(
            "flex items-center gap-2 w-full", 
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
