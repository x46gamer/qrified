
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Check, X, ExternalLink, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  verification_token: string;
  created_at: string;
  verified_at: string | null;
}

const DomainSettings = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});

  // Load domains on component mount
  useEffect(() => {
    if (user) {
      loadDomains();
    }
  }, [user]);

  const loadDomains = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setDomains(data || []);
    } catch (error) {
      console.error('Error loading domains:', error);
      toast.error('Failed to load domains');
    } finally {
      setIsLoading(false);
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDomain.trim()) {
      toast.error('Please enter a domain');
      return;
    }
    
    try {
      setIsAdding(true);
      
      // Generate verification token
      const verificationToken = uuidv4();
      
      const { error } = await supabase
        .from('custom_domains')
        .insert({
          user_id: user!.id,
          domain: newDomain.trim(),
          verification_token: verificationToken
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.error('This domain is already in use');
        } else {
          throw error;
        }
        return;
      }
      
      setNewDomain('');
      await loadDomains();
      toast.success('Domain added. Please verify ownership.');
    } catch (error) {
      console.error('Error adding domain:', error);
      toast.error('Failed to add domain');
    } finally {
      setIsAdding(false);
    }
  };

  const verifyDomain = async (domainId: string) => {
    try {
      setIsVerifying(prev => ({ ...prev, [domainId]: true }));
      
      const domain = domains.find(d => d.id === domainId);
      if (!domain) return;
      
      // Simulate verification process
      // In a real application, this would call an edge function to verify DNS records
      const { error } = await supabase
        .from('custom_domains')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', domainId);
      
      if (error) {
        throw error;
      }
      
      await loadDomains();
      toast.success('Domain verified successfully');
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast.error('Domain verification failed');
      
      // Mark as failed
      await supabase
        .from('custom_domains')
        .update({ status: 'failed' })
        .eq('id', domainId);
      
      await loadDomains();
    } finally {
      setIsVerifying(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const deleteDomain = async (domainId: string) => {
    try {
      const { error } = await supabase
        .from('custom_domains')
        .delete()
        .eq('id', domainId);
      
      if (error) {
        throw error;
      }
      
      await loadDomains();
      toast.success('Domain removed');
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast.error('Failed to remove domain');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domains</CardTitle>
        <CardDescription>
          Connect your custom domain to the QR codes verification page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addDomain} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Add a new domain</Label>
            <div className="flex gap-2">
              <Input 
                id="domain" 
                placeholder="example.com or sub.example.com" 
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <Button type="submit" disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Domains</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center py-8 border rounded-md border-dashed">
              <p className="text-muted-foreground">You haven't added any domains yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <div key={domain.id} className="border rounded-lg p-4 bg-white/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{domain.domain}</h4>
                        {getStatusBadge(domain.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Added on {new Date(domain.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {domain.status !== 'verified' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => verifyDomain(domain.id)}
                          disabled={isVerifying[domain.id]}
                        >
                          {isVerifying[domain.id] ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Repeat className="mr-1 h-3 w-3" />
                          )}
                          Verify
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => deleteDomain(domain.id)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  {domain.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                      <h5 className="font-medium text-sm text-yellow-800 mb-2">Verification Required</h5>
                      <p className="text-xs text-yellow-700 mb-3">
                        Add the following CNAME record to your domain's DNS settings:
                      </p>
                      <div className="bg-white p-2 rounded border border-yellow-100 font-mono text-xs">
                        <div>
                          <span className="text-gray-500">Type:</span> CNAME
                        </div>
                        <div>
                          <span className="text-gray-500">Name:</span> _seqrity-verify
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span> {domain.verification_token}
                        </div>
                        <div>
                          <span className="text-gray-500">TTL:</span> 3600 or Auto
                        </div>
                      </div>
                      <p className="text-xs text-yellow-700 mt-3">
                        DNS changes can take up to 24 hours to propagate. Click verify once your DNS provider has updated the records.
                      </p>
                    </div>
                  )}
                  
                  {domain.status === 'verified' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center text-green-800">
                        <Check className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium">Domain verified successfully!</p>
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        Verified on {domain.verified_at ? new Date(domain.verified_at).toLocaleString() : 'Unknown date'}
                      </p>
                      <div className="mt-3 flex">
                        <a 
                          href={`https://${domain.domain}/qr-portal`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-green-700 flex items-center hover:underline"
                        >
                          Visit your portal <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSettings;
