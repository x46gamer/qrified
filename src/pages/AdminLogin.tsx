
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('soufian3hm@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in as admin, redirect to admin dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If user is logged in but not admin, show error
  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have admin privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Only allow the specific admin email
      if (email !== 'soufian3hm@gmail.com') {
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      
      // Sign out any existing user first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Clear any existing auth state
      localStorage.removeItem('qrauth_user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Direct Supabase login instead of using auth context
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error("Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }
      
      // Check if the user is an admin
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError || userProfile?.role !== 'admin') {
        toast.error("Access denied. Admin privileges required.");
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      // Store admin user info
      const adminUser = {
        id: data.user.id,
        role: 'admin',
        name: 'Admin User',
        email: data.user.email,
      };
      localStorage.setItem('qrauth_user', JSON.stringify(adminUser));
      
      toast.success("Welcome back, Admin!");
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error("An error occurred during login.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
