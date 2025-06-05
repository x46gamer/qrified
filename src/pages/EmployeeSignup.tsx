import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EmployeeSignup = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { signUpEmployee, isAuthenticated } = useAuth(); // Assuming signUpEmployee function exists in AuthContext

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationValid, setInvitationValid] = useState(false);

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!token) {
        setError('No invitation token provided.');
        setIsLoading(false);
        return;
      }

      try {
        // Verify the token and get the invited email
        const { data, error } = await supabase
          .from('user_invites')
          .select('email')
          .eq('token', token)
          .is('accepted_at', null) // Ensure it hasn't been used
          .gte('expires_at', new Date().toISOString()) // Ensure it hasn't expired
          .single();

        if (error || !data) {
          console.error('Invitation verification failed:', error);
          setError('Invalid, expired, or already used invitation token.');
          setInvitationValid(false);
        } else {
          setEmail(data.email);
          setInvitationValid(true);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error verifying invitation:', err);
        setError('An error occurred while verifying the invitation.');
        setInvitationValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      verifyInvitation();
    } else {
      // If already logged in, maybe redirect to dashboard?
      navigate('/dashboard');
    }
  }, [token, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!invitationValid || !email) {
        setError('Cannot sign up with an invalid invitation.');
        return;
    }

    try {
      setIsSubmitting(true);
      // Call a specific signup function for employees
      await signUpEmployee(email, password, token); // Pass token to mark invitation as accepted
      // If successful, navigate to the dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up as employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!invitationValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12 text-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl transition-all animate-fade-in">
           <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">Invalid Invitation</CardTitle>
           </CardHeader>
           <CardContent>
             {error && (
               <p className="text-red-600 mb-4">{error}</p>
             )}
             <p>Please check your invitation link or contact the inviting administrator.</p>
           </CardContent>
           <CardFooter className="flex flex-col">
             <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
           </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-full">
        <div className="container mx-auto py-5">
          <Link to="/" className="text-xl font-bold block">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">QRified</span>
          </Link>
        </div>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl transition-all animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Accept Invitation
          </CardTitle>
          <CardDescription>
            Create your employee account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled // Email is pre-filled and not editable
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all shadow hover:shadow-blue-300/30"
            >
              {isSubmitting ? "Creating Account..." : "Create Employee Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-500 mt-4">
            <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeSignup; 