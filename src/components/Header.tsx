import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { MenuIcon, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 750);
  const isMobile = useIsMobile();
  
  // Use try-catch to safely access sidebar context
  let sidebar = { 
    state: null as any, 
    toggleSidebar: () => {}, 
    openMobile: false, 
    setOpenMobile: (open: boolean) => {} 
  };
  
  try {
    sidebar = useSidebar();
  } catch (e) {
    // Context not available, will use defaults
  }
  
  const { state, toggleSidebar, openMobile, setOpenMobile } = sidebar;
  const isExpanded = state === 'expanded';
  
  // Handle scroll events for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 750);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  // This is the unified handler for sidebar toggling
  const handleToggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      toggleSidebar();
    }
  };

  return (
    <>
      {isSmallScreen && (
        <header className={cn(
          "sticky top-0 w-full z-50 transition-all duration-300 py-1",
          scrolled 
            ? "bg-white/90 shadow-md backdrop-blur-sm py-1" 
            : "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4"
        )}>
          <div className="container mx-auto flex items-center px-4">
            {user && isSmallScreen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleSidebar} 
                className="mr-2"
                title={isMobile ? (openMobile ? "Close sidebar" : "Open sidebar") : (isExpanded ? "Collapse sidebar" : "Expand sidebar")}
              >
                {isMobile ? (
                  openMobile ? <X size={20} /> : <MenuIcon size={20} />
                ) : (
                  isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />
                )}
                <span className="sr-only">
                  {isMobile ? (openMobile ? "Close Sidebar" : "Open Sidebar") : (isExpanded ? "Collapse Sidebar" : "Expand Sidebar")}
                </span>
              </Button>
            )}
            
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center gap-2">
                
              </Link>
            </div>
            
            <div className="md:flex items-center gap-3 hidden">
              {!user && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-violet-500" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
              {user && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              )}
            </div>
            
            {/* Mobile menu button - only show for non-logged in users */}
            {!user && (
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </Button>
            )}
          </div>
          
          {/* Mobile menu - only for non-logged in users */}
          {mobileMenuOpen && !user && (
            <div className="md:hidden bg-white border-b border-gray-100 shadow-lg animate-fade-in">
              <div className="container mx-auto py-4 px-4 space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button variant="default" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-500 to-violet-500" asChild>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </header>
      )}
    </>
  );
};

export default Header;
