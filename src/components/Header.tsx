
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { LogOutIcon, MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">seQRity</span>
            </h2>
          </Link>
        </div>
        
        <div className="md:flex items-center gap-3 hidden">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
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
        
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg animate-fade-in">
          <div className="container mx-auto py-4 px-4 space-y-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button variant="default" size="sm" className="w-full justify-start bg-gradient-to-r from-blue-500 to-violet-500" asChild>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
