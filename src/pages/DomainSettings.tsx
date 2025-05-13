
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Check, Copy, Shield, Loader2 } from "lucide-react";

interface Domain {
  id: string;
  domain: string;
  verification_token: string;
  status: string;
  ssl_status?: string;
  verified_at: string | null;
  created_at: string;
}

const DomainSettings = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState<Record<string, boolean>>({});
  const [sslCheckLoading, setSslCheckLoading] = useState<Record<string, boolean>>({});

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
  
  // Effect to check SSL status for verified domains on load
  useEffect(() => {
    const verifiedDomains = domains.filter(domain => domain.status === 'verified');
    verifiedDomains.forEach(domain => {
      if (!domain.ssl_status || domain.ssl_status === 'pending') {
        checkSSLStatus(domain.id, domain.domain);
      }
    });
  }, [domains]);

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
      const { data, error } = await supabase
        .from('custom_domains')
        .insert([
          {
            user_id: user.id,
            domain: newDomain,
            verification_token: "not_used_anymore", // We don't use tokens with CNAME/A verification
            ssl_status: "pending" // Default SSL status is pending
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

  const verifyDomain = async (domainId: string, domain: string) => {
    setVerificationLoading(prev => ({ ...prev, [domainId]: true }));
    
    try {
      // Call the verify-domain edge function to check DNS records
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domain }
      });
      
      if (error) throw error;
      
      if (data.verified) {
        toast.success('Domain verified successfully! SSL provisioning has started.');
        fetchDomains();
      } else {
        toast.error(data.message || 'Verification failed. DNS records not found or not propagated yet.');
      }
    } catch (error: any) {
      toast.error('Verification error: ' + error.message);
    } finally {
      setVerificationLoading(prev => ({ ...prev, [domainId]: false }));
    }
  };
  
  const checkSSLStatus = async (domainId: string, domain: string) => {
    setSslCheckLoading(prev => ({ ...prev, [domainId]: true }));
    
    try {
      // Call the verify-domain edge function with check_ssl action
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domain, action: 'check_ssl' }
      });
      
      if (error) throw error;
      
      if (data.ssl.isValid) {
        toast.success(`SSL certificate is ${data.ssl.status} for ${domain}`);
        // Update local state to reflect the new SSL status
        setDomains(domains.map(d => {
          if (d.id === domainId) {
            return { ...d, ssl_status: data.ssl.status };
          }
          return d;
        }));
      } else {
        if (data.ssl.status === 'pending') {
          toast.info(`SSL certificate is still provisioning for ${domain}. This can take up to 10 minutes.`);
        } else {
          toast.error(`SSL certificate failed for ${domain}. Please check your DNS settings.`);
        }
      }
    } catch (error: any) {
      toast.error('SSL check error: ' + error.message);
    } finally {
      setSslCheckLoading(prev => ({ ...prev, [domainId]: false }));
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

  // Get root domain (for www. domains)
  const getRootDomain = (domain: string) => {
    return domain.startsWith('www.') ? domain.substring(4) : domain;
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
        <p className="text-lg text-muted-foreground">Connect your custom domain to QRified</p>
      </header>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Domain</CardTitle>
            <CardDescription>
              Connect your own domain to QRified for a white-labeled experience
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
                  After adding your domain, you'll need to create DNS records at your domain provider pointing to QRified's servers. 
                  This allows us to verify that you own the domain and properly serve your content securely with SSL.
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
                        <div className="flex gap-2 items-center">
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
                          
                          {domain.status === 'verified' && (
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                              domain.ssl_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : domain.ssl_status === 'pending'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              <Shield className="w-3 h-3 mr-1" />
                              {domain.ssl_status === 'active' 
                                ? 'SSL Active'
                                : domain.ssl_status === 'pending'
                                  ? 'SSL Provisioning'
                                  : 'SSL Failed'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {domain.status === 'verified' && (
                          <Button 
                            variant="outline"
                            onClick={() => checkSSLStatus(domain.id, domain.domain)}
                            disabled={!!sslCheckLoading[domain.id]}
                            size="sm"
                          >
                            {sslCheckLoading[domain.id] ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Checking...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Check SSL
                              </>
                            )}
                          </Button>
                        )}
                        
                        {domain.status !== 'verified' && (
                          <Button 
                            variant="outline"
                            onClick={() => verifyDomain(domain.id, domain.domain)}
                            disabled={!!verificationLoading[domain.id]}
                          >
                            {verificationLoading[domain.id] ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Verifying...
                              </>
                            ) : 'Verify'}
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
                          Create the following DNS records with your domain provider:
                        </p>
                        
                        {domain.domain.startsWith('www.') ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200">
                              <div className="font-mono text-sm">
                                <span className="font-medium">Type:</span> CNAME<br/>
                                <span className="font-medium">Name:</span> www<br/>
                                <span className="font-medium">Value:</span> qrified.app
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard('qrified.app')}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                            </div>
                            
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200">
                              <div className="font-mono text-sm">
                                <span className="font-medium">Type:</span> CNAME<br/>
                                <span className="font-medium">Name:</span> qr<br/>
                                <span className="font-medium">Value:</span> qrified.app
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard('qrified.app')}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200">
                              <div className="font-mono text-sm">
                                <span className="font-medium">Type:</span> A<br/>
                                <span className="font-medium">Name:</span> @<br/>
                                <span className="font-medium">Value:</span> 76.76.21.21
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard('76.76.21.21')}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                            </div>
                            
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-amber-200">
                              <div className="font-mono text-sm">
                                <span className="font-medium">Type:</span> CNAME<br/>
                                <span className="font-medium">Name:</span> qr<br/>
                                <span className="font-medium">Value:</span> qrified.app
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard('qrified.app')}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-100">
                          <div className="flex items-start">
                            <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800">SSL Certificate (HTTPS)</p>
                              <p className="text-sm text-blue-700 mt-1">
                                SSL certificates are generated automatically once your domain is verified. This ensures your custom domain uses secure HTTPS connections. The process can take up to 10 minutes after verification.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-amber-700 mt-2">
                          DNS changes may take up to 24-48 hours to propagate. Check back later if verification fails.
                        </p>
                      </div>
                    )}
                    
                    {domain.status === 'verified' && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Verified on: {new Date(domain.verified_at!).toLocaleDateString()}
                        </div>
                        
                        {domain.ssl_status === 'active' ? (
                          <Alert className="bg-green-50 border border-green-100">
                            <div className="flex items-start">
                              <Shield className="h-5 w-5 text-green-600 mr-2" />
                              <div>
                                <AlertTitle className="text-green-800">SSL Certificate Active</AlertTitle>
                                <AlertDescription className="text-green-700">
                                  Your domain is secured with SSL and can be accessed via https://{domain.domain}. SSL certificates are automatically renewed.
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        ) : domain.ssl_status === 'pending' ? (
                          <Alert className="bg-blue-50 border border-blue-100">
                            <div className="flex items-start">
                              <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                              <div>
                                <AlertTitle className="text-blue-800">SSL Certificate Provisioning</AlertTitle>
                                <AlertDescription className="text-blue-700">
                                  SSL certificate is being provisioned for your domain. This process can take up to 10 minutes. You can check the status by clicking "Check SSL" button.
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        ) : (
                          <Alert className="bg-red-50 border border-red-100">
                            <div className="flex items-start">
                              <Shield className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <AlertTitle className="text-red-800">SSL Certificate Failed</AlertTitle>
                                <AlertDescription className="text-red-700">
                                  There was an issue provisioning the SSL certificate for your domain. Please check your DNS settings and try again.
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        )}
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
