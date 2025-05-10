
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee' | null;
  allowPublic?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole, 
  allowPublic = false,
  redirectTo = "/login"
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For routes that are only for non-authenticated users (like login, signup)
  if (allowPublic && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // For protected routes that require authentication
  if (!allowPublic && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the user doesn't have it, redirect to home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
