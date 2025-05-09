
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Domain {
  id: string;
  domain: string;
  verification_token: string;
  status: string;
  created_at: string;
  verified_at: string | null;
}

const DomainSettings: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);
  
  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setDomains(data as Domain[]);
      }
    } catch (error: any) {
      console.error('Error fetching domains:', error.message);
      toast.error('Failed to load domains');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addDomain = async () => {
    try {
      if (!domain) {
        toast.error('Please enter a domain');
        return;
      }
      
      // Very basic domain validation
      if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain)) {
        toast.error('Please enter a valid domain');
        return;
      }
      
      setIsLoading(true);
      
      // Generate a verification token
      const verificationToken = uuidv4();
      
      const { error } = await supabase
        .from('custom_domains')
        .insert([
          {
            user_id: user?.id,
            domain,
            verification_token: verificationToken,
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Domain added successfully');
      setDomain('');
      await fetchDomains();
    } catch (error: any) {
      console.error('Error adding domain:', error.message);
      toast.error('Failed to add domain');
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyDomain = async (domainId: string) => {
    try {
      setIsVerifying(true);
      
      const domainToVerify = domains.find(d => d.id === domainId);
      
      if (!domainToVerify) {
        toast.error('Domain not found');
        return;
      }
      
      // In a real implementation, we would check the DNS records here
      // For demo purposes, we'll simulate a successful verification
      const { error } = await supabase
        .from('custom_domains')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', domainId);
      
      if (error) throw error;
      
      toast.success('Domain verified successfully');
      await fetchDomains();
    } catch (error: any) {
      console.error('Error verifying domain:', error.message);
      toast.error('Failed to verify domain');
    } finally {
      setIsVerifying(false);
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
      await fetchDomains();
    } catch (error: any) {
      console.error('Error deleting domain:', error.message);
      toast.error('Failed to delete domain');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain Settings</CardTitle>
        <CardDescription>Connect your own domain or subdomain to your QR codes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-white/50">
            <Label htmlFor="domain">Add Domain or Subdomain</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                id="domain" 
                placeholder="yourdomain.com or sub.yourdomain.com" 
                value={domain} 
                onChange={(e) => setDomain(e.target.value)}
              />
              <Button 
                onClick={addDomain}
                disabled={isLoading}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-white/50">
            <h3 className="font-medium mb-4">Your Domains</h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading domains...</p>
              </div>
            ) : domains.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No domains added yet</p>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="border rounded p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{domain.domain}</h4>
                        <p className="text-sm text-gray-500">Status: 
                          <span className={
                            domain.status === 'verified' ? "text-green-500 ml-1" : "text-yellow-500 ml-1"
                          }>
                            {domain.status === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </p>
                      </div>
                      <div>
                        {domain.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mb-2"
                            onClick={() => verifyDomain(domain.id)}
                            disabled={isVerifying}
                          >
                            Verify
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 ml-2"
                          onClick={() => deleteDomain(domain.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    {domain.status === 'pending' && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                        <p className="font-medium mb-1">To verify this domain:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Add a CNAME record in your DNS settings</li>
                          <li>Point it to <span className="font-mono bg-gray-100 px-1">xowxgbovrbnpsreqgrlt.supabase.co</span></li>
                          <li>Use <span className="font-mono bg-gray-100 px-1">@</span> for root domain or <span className="font-mono bg-gray-100 px-1">subdomain</span> for subdomains</li>
                          <li>Add a TXT record with name <span className="font-mono bg-gray-100 px-1">_seqrity</span></li>
                          <li>Set its value to <span className="font-mono bg-gray-100 px-1">{domain.verification_token}</span></li>
                          <li>After DNS propagation (may take up to 24h), click 'Verify'</li>
                        </ol>
                      </div>
                    )}
                    
                    {domain.status === 'verified' && (
                      <div className="mt-2 text-sm">
                        <p>Verified on: {new Date(domain.verified_at!).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSettings;
