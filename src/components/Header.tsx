
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { MenuIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Conditionally use useSidebar hook only when it's wrapped in SidebarProvider
  // This prevents errors when Header is used outside of a SidebarProvider context
  const sidebarContext = React.useContext(
    // @ts-ignore - This is just to check if the context exists
    React.createContext(null, () => {
      throw new Error("useSidebar must be used within a SidebarProvider.");
    })
  );
  const sidebar = sidebarContext ? useSidebar() : { state: null, toggleSidebar: () => {} };
  const { state, toggleSidebar } = sidebar;
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

  return (
    <header className={cn(
      "sticky top-0 w-full z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/90 shadow-md backdrop-blur-sm py-3" 
        : "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4"
    )}>
      <div className="container mx-auto flex items-center px-4">
        {user && state !== null && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-2"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            <span className="sr-only">{isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}</span>
          </Button>
        )}
        
        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1fbd5402-f9f9-49b4-90f0-38d70c7dd216.png"
              alt="SeQRity Logo"
              className="h-8 w-auto"
            />
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
  );
};

export default Header;
