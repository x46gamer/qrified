import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Shield } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import supabase if needed to fetch plan info
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('store_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user settings:', error);
          toast.error('Failed to fetch settings.');
        } else if (data) {
          setCompanyName(data.store_name || '');
        }
      }
    };

    fetchSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ store_name: companyName })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings.');
    } else {
      toast.success('Settings saved successfully!');
    }
    setIsLoading(false);
  };

  // TODO: Fetch user's current plan details
  // You'll likely need a state variable and a useEffect hook here
  // Example: const [currentPlan, setCurrentPlan] = useState(null);
  // useEffect(() => { ... fetch plan ... }, [user]);

  // TODO: Implement logic to get Stripe customer portal URL
  const handleManagePlan = async () => {
    // This will likely require a backend call to generate a customer portal session URL
    console.log('Manage plan clicked');
    // Example: const { data } = await supabase.functions.invoke('create-customer-portal', { userId: user.id });
    // if (data?.url) { window.location.href = data.url; }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
        <p className="text-lg text-muted-foreground">Manage your team and system settings</p>
      </header>
      
      <Tabs defaultValue="team" className="space-y-8" >
        <TabsList className="grid w-full max-w-md grid-cols-4 [display:contents]">
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="help">Help & Resources</TabsTrigger>
          {/* Add Plan & Billing Tab */}
          {!isAdmin && <TabsTrigger value="plan">Plan & Billing</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Add, edit or remove team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Employee User</h3>
                      <p className="text-sm text-gray-500">employee@example.com</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Label htmlFor="new-member">Add Team Member</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="new-member" placeholder="Email address" />
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <Label htmlFor="company-name">Store Name</Label>
                  <Input 
                    id="company-name" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1" 
                  />
                </div>
                
                <div className="border rounded-lg p-4">
                  <Label htmlFor="default-template">Default QR Template</Label>
                  <select 
                    id="default-template"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern-blue">Modern Blue</option>
                    <option value="modern-beige">Modern Beige</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Connect your own domain to QRified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-violet-50">
                  <h3 className="font-medium mb-2">White-Label Domain with SSL</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your own domain to QRified for a fully branded experience.
                    Your customers will see your domain with secure HTTPS instead of QRified.app when scanning QR codes.
                  </p>
                  <div className="flex items-center gap-2 mb-4 bg-blue-100 p-2 rounded-md">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Automatic SSL certificates included - no additional setup required!
                    </p>
                  </div>
                  
                  <Link to="/domains">
                    <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                      Manage Domains
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Resources</CardTitle>
              <CardDescription>Get help and find information about our service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/about" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    About Us <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Learn more about our company and mission</p>
                </Link>
                
                <Link to="/faq" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    Frequently Asked Questions <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Find answers to common questions</p>
                </Link>
                
                <Link to="/contact" className="block border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium flex items-center">
                    Contact Support <ExternalLink className="ml-1 h-4 w-4" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Get in touch with our support team</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Plan & Billing TabsContent */}
        {!isAdmin && (
          <TabsContent value="plan">
            <Card>
              <CardHeader>
                <CardTitle>Plan & Billing</CardTitle>
                <CardDescription>Manage your subscription and view billing information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* TODO: Display current plan details */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Your Current Plan</h3>
                  <p className="text-sm text-gray-600">{/* Display plan name here */}
                    {/* Example: {currentPlan ? currentPlan.name : 'Loading plan...'} */}
                    Loading plan...
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium mb-2">Manage Subscription</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Update your payment method, change your plan, or cancel your subscription.
                  </p>
                  <Button onClick={handleManagePlan} className="bg-blue-600 hover:bg-blue-700">
                    Go to Billing Portal
                  </Button>
                </div>
                
                {/* TODO: Optionally add billing history section */}
              </CardContent>
            </Card>
          </TabsContent>
        )}

      </Tabs>
    </div>
  );
};

export default Settings;
