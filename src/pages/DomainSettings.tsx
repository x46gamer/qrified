
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Check } from "lucide-react";

interface Domain {
  id: string;
  domain: string;
  verification_token: string;
  status: string;
  verified_at: string | null;
  created_at: string;
}

const DomainSettings = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState<Record<string, boolean>>({});

  // Fetch user's domains
  const fetchDomains = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setDomains(data || []);
    } catch (error: any) {
      toast.error('Failed to load domains: ' + error.message);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [user]);

  const addDomain = async () => {
    if (!user) {
      toast.error('You must be logged in to add a domain');
      return;
    }
    
    if (!newDomain) {
      toast.error('Please enter a domain');
      return;
    }
    
    // Simple domain validation
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainPattern.test(newDomain)) {
      toast.error('Please enter a valid domain (e.g., yourdomain.com)');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + 
                              Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('custom_domains')
        .insert([
          {
            user_id: user.id,
            domain: newDomain,
            verification_token: verificationToken,
          }
        ])
        .select();
      
      if (error) {
        if (error.code === '23505') {
          toast.error('This domain is already registered');
        } else {
          toast.error('Failed to add domain: ' + error.message);
        }
        return;
      }
      
      toast.success('Domain added successfully! Please verify ownership.');
      setNewDomain('');
      fetchDomains();
    } catch (error: any) {
      toast.error('Failed to add domain: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDomain = async (domainId: string, domain: string, token: string) => {
    setVerificationLoading(prev => ({ ...prev, [domainId]: true }));
    
    try {
      // Call the verify-domain edge function to check DNS records
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domain, token }
      });
      
      if (error) throw error;
      
      if (data.verified) {
        toast.success('Domain verified successfully!');
        fetchDomains();
      } else {
        toast.error(data.message || 'Verification failed. DNS record not found or not propagated yet.');
      }
    } catch (error: any) {
      toast.error('Verification error: ' + error.message);
    } finally {
      setVerificationLoading(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const deleteDomain = async (domainId: string) => {
    try {
      const { error } = await supabase
        .from('custom_domains')
        .delete()
        .eq('id', domainId);
      
      if (error) throw error;
      
      toast.success('Domain deleted successfully');
      fetchDomains();
    } catch (error: any) {
      toast.error('Failed to delete domain: ' + error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Domain Settings</CardTitle>
            <CardDescription>You must be logged in to manage domains</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Domain Settings</h1>
        <p className="text-lg text-muted-foreground">Connect your custom domain to SeQRity</p>
      </header>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Domain</CardTitle>
            <CardDescription>
              Connect your own domain to SeQRity for a white-labeled experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Enter domain (e.g., yourdomain.com)" 
                  value={newDomain} 
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={addDomain} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
                >
                  {isLoading ? 'Adding...' : 'Add Domain'}
                </Button>
              </div>
              
              <Alert className="bg-blue-50 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">How white-labeling works</AlertTitle>
                <AlertDescription className="text-blue-700">
                  After adding your domain, you'll need to create a TXT record at your domain provider pointing to SeQRity's servers. 
                  This allows us to verify that you own the domain and properly serve your content.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
            <CardDescription>Manage domains associated with your account</CardDescription>
          </CardHeader>
          <CardContent>
            {domains.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No domains added yet. Add your first domain above.
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="border rounded-lg p-4 bg-white/50 transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{domain.domain}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          domain.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {domain.status === 'verified' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            'Pending Verification'
                          )}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {domain.status !== 'verified' && (
                          <Button 
                            variant="outline"
                            onClick={() => verifyDomain(domain.id, domain.domain, domain.verification_token)}
                            disabled={verificationLoading[domain.id]}
                          >
                            {verificationLoading[domain.id] ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                        <Button 
                          variant="destructive"
                          onClick={() => deleteDomain(domain.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    {domain.status !== 'verified' && (
                      <div className="mt-4 bg-amber-50 p-3 rounded-md">
                        <p className="font-medium text-amber-900 mb-2">Verification Required</p>
                        <p className="text-sm text-amber-800 mb-2">
                          Create a TXT record with your DNS provider using these values:
                        </p>
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200 mb-2">
                          <span className="font-mono text-sm">Host/Name: @</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard('@')}>
                            Copy
                          </Button>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200">
                          <span className="font-mono text-sm truncate">Value: seqrity-verify={domain.verification_token}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(`seqrity-verify=${domain.verification_token}`)}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-amber-700 mt-2">
                          DNS changes may take up to 24-48 hours to propagate. Check back later if verification fails.
                        </p>
                      </div>
                    )}
                    
                    {domain.status === 'verified' && (
                      <div className="mt-2 text-sm text-gray-600">
                        Verified on: {new Date(domain.verified_at!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainSettings;
