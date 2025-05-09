
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { LogOutIcon, HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  
  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">QR Code Authentication System</h2>
          {user && <p className="text-sm text-muted-foreground">Logged in as {user.role}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          {user && (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Log out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
