
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
        <p className="text-lg text-muted-foreground">Manage your team and system settings</p>
      </header>
      
      <Tabs defaultValue="team" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
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
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="My Company" className="mt-1" />
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
                
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
