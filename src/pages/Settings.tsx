
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import UserManagement from '@/components/UserManagement';
import DomainSettings from '@/components/DomainSettings';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('section') || 'team';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const handleTabChange = (value: string) => {
    setSearchParams({ section: value });
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
        <p className="text-lg text-muted-foreground">Manage your team and system settings</p>
      </header>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="domains">Custom Domains</TabsTrigger>
          <TabsTrigger value="help">Help & Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team">
          {isAdmin ? (
            <UserManagement />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>You need admin privileges to access this section.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p>This section is only accessible to administrators. Please contact your administrator for assistance.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="domains">
          {isAdmin ? (
            <DomainSettings />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Custom Domains</CardTitle>
                <CardDescription>You need admin privileges to access this section.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p>This section is only accessible to administrators. Please contact your administrator for assistance.</p>
                </div>
              </CardContent>
            </Card>
          )}
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
      </Tabs>
    </div>
  );
};

export default Settings;
