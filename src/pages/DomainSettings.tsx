import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, ExternalLink, Copy, Trash2 } from 'lucide-react';

interface CustomDomain {
  id: string;
  domain: string;
  status: string;
  verification_token: string;
  ssl_status: string | null;
  verified_at: string | null;
  created_at: string;
  user_id: string;
  dns_type: 'cname' | 'a' | 'nameservers' | 'txt';
}

const DomainSettings = () => {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isVerifyingDomain, setIsVerifyingDomain] = useState<string | null>(null);
  const [dnsType, setDnsType] = useState<'cname' | 'a' | 'nameservers'>('cname');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  const fetchDomains = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch domains');
        return;
      }

      // Ensure all domains have a dns_type
      const domainsWithType = (data || []).map(domain => ({
        ...domain,
        dns_type: domain.dns_type || 'cname' // Default to 'cname' if not set
      }));

      setDomains(domainsWithType);
    } catch (error) {
      toast.error('An error occurred while fetching domains');
    } finally {
      setIsLoading(false);
    }
  };

  const addDomain = async () => {
    if (!newDomain.trim() || !user) {
      toast.error('Please enter a valid domain');
      return;
    }

    setIsAddingDomain(true);
    try {
      const verificationToken = `verify_${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase
        .from('custom_domains')
        .insert({
          user_id: user.id,
          domain: newDomain.trim().toLowerCase(),
          status: 'pending',
          verification_token: verificationToken,
          ssl_status: 'pending',
          dns_type: dnsType
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to add domain');
        return;
      }

      toast.success('Domain added successfully');
      setNewDomain('');
      fetchDomains();
    } catch (error) {
      toast.error('An error occurred while adding domain');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_domains')
        .delete()
        .eq('id', domainId);

      if (error) {
        toast.error('Failed to delete domain');
        return;
      }

      toast.success('Domain deleted successfully');
      fetchDomains();
    } catch (error) {
      toast.error('An error occurred while deleting domain');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getSSLBadge = (sslStatus: string | null) => {
    switch (sslStatus) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const verifyDomain = async (domain: string) => {
    try {
      setIsVerifyingDomain(domain);
      const { data: domainData } = await supabase
        .from('custom_domains')
        .select('dns_type')
        .eq('domain', domain)
        .single();

      const dnsType = domainData?.dns_type || 'cname';

      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { 
          domain,
          action: 'verify',
          dns_type: dnsType
        }
      });

      if (error) throw error;

      if (data.verified) {
        toast.success('Domain verified successfully!');
        await fetchDomains();
      } else {
        toast.error(data.message || 'Domain verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify domain');
    } finally {
      setIsVerifyingDomain(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Custom Domains</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              <div>
                <Label>DNS Configuration Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={dnsType === 'cname' ? 'default' : 'outline'}
                    onClick={() => setDnsType('cname')}
                    className="w-full"
                  >
                    CNAME
                  </Button>
                  <Button
                    type="button"
                    variant={dnsType === 'a' ? 'default' : 'outline'}
                    onClick={() => setDnsType('a')}
                    className="w-full"
                  >
                    A Record
                  </Button>
                  <Button
                    type="button"
                    variant={dnsType === 'nameservers' ? 'default' : 'outline'}
                    onClick={() => setDnsType('nameservers')}
                    className="w-full"
                  >
                    Nameservers
                  </Button>
                </div>
              </div>
              <Button 
                onClick={addDomain} 
                disabled={isAddingDomain}
                className="w-full"
              >
                {isAddingDomain ? 'Adding...' : 'Add Domain'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="space-y-4 bg-white shadow-sm rounded-lg ">
        <CardHeader >
          <CardTitle>Domain Management</CardTitle>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No custom domains added yet</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Domain
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Domain</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="domain">Domain Name</Label>
                      <Input
                        id="domain"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example.com"
                      />
                    </div>
                    <Button 
                      onClick={addDomain} 
                      disabled={isAddingDomain}
                      className="w-full"
                    >
                      {isAddingDomain ? 'Adding...' : 'Add Domain'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSL Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {domain.domain}
                        {domain.status === 'verified' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(domain.status)}</TableCell>
                    <TableCell>{getSSLBadge(domain.ssl_status)}</TableCell>
                    <TableCell>
                      {new Date(domain.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {domain.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(domain.verification_token)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy Token
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => verifyDomain(domain.domain)}
                              disabled={isVerifyingDomain === domain.domain}
                            >
                              {isVerifyingDomain === domain.domain ? 'Verifying...' : 'Verify'}
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDomain(domain.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {domains.some(d => d.status === 'pending') && (
        <Card>
          <CardHeader>
            <CardTitle>Domain Verification Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To verify your domain, add the following DNS records:
            </p>
            
            {domains
              .filter(d => d.status === 'pending')
              .map(domain => (
                <div key={domain.id} className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">{domain.domain}</h4>
                  
                  {domain.dns_type === 'txt' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Add the following TXT record to your domain's DNS settings:
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Type: TXT</p>
                            <p className="text-sm">Name: @</p>
                            <p className="text-sm">Value: qrified-verify={domain.domain}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`qrified-verify=${domain.domain}`);
                              toast.success('TXT record copied to clipboard!');
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : domain.dns_type === 'a' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Type:</strong> A
                        </div>
                        <div>
                          <strong>Name:</strong> {domain.domain}
                        </div>
                        <div className="flex items-center gap-2">
                          <strong>Value:</strong> 
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            76.76.21.21
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('76.76.21.21')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Type:</strong> CNAME
                        </div>
                        <div>
                          <strong>Name:</strong> {domain.domain}
                        </div>
                        <div className="flex items-center gap-2">
                          <strong>Value:</strong> 
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            qrified.app
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('qrified.app')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {domain.dns_type === 'nameservers' && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Update your domain's nameservers to:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            ns1.qrified.app
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('ns1.qrified.app')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            ns2.qrified.app
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('ns2.qrified.app')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Type:</strong> TXT
                    </div>
                    <div>
                      <strong>Name:</strong> _qrified-verification
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Value:</strong> 
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {domain.verification_token}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(domain.verification_token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            
            <p className="text-sm text-muted-foreground">
              After adding the DNS records, it may take up to 24 hours for verification to complete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainSettings;
