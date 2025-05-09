
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeManager from '@/components/QRCodeManager';
import QRCodeAnalytics from '@/components/QRCodeAnalytics';
import UserManagement from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QRCode } from '@/types/qrCode';
import { toast } from 'sonner';
import AppearanceSettings from '@/components/AppearanceSettings';

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'dashboard';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);

  useEffect(() => {
    const fetchLastSequentialNumber = async () => {
      if (!user) return;
      
      try {
        // Find the highest sequential number used in existing QR codes
        const { data, error } = await supabase
          .from('qr_codes')
          .select('data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const numbers = data
            .map(item => {
              const uniqueId = item.data?.uniqueId;
              if (!uniqueId) return 0;
              
              // If uniqueId is a number or looks like a padded number (e.g., "000123")
              const num = parseInt(uniqueId);
              return !isNaN(num) ? num : 0;
            })
            .filter(num => num > 0);
          
          if (numbers.length > 0) {
            setLastSequentialNumber(Math.max(...numbers));
          }
        }
      } catch (err) {
        console.error("Error fetching last sequential number:", err);
      }
    };

    fetchLastSequentialNumber();
  }, [user]);
  
  const handleQRCodesGenerated = async (newQRCodes: QRCode[]) => {
    if (!user || !newQRCodes.length) return;
    
    try {
      // Find the highest sequential number in the newly generated QR codes
      const newNumbers = newQRCodes
        .map(code => {
          const uniqueId = code.data?.uniqueId;
          if (!uniqueId) return 0;
          
          const num = parseInt(uniqueId);
          return !isNaN(num) ? num : 0;
        })
        .filter(num => num > 0);
      
      if (newNumbers.length > 0) {
        const highestNewNumber = Math.max(...newNumbers);
        setLastSequentialNumber(prevNum => Math.max(prevNum, highestNewNumber));
      }
      
      // Save the new QR codes to the database
      const { error } = await supabase.from('qr_codes').insert(
        newQRCodes.map(code => ({
          id: code.id,
          user_id: user.id,
          data: code.data,
          created_at: new Date().toISOString(),
          scans: 0
        }))
      );
      
      if (error) throw error;
      
      toast.success(`${newQRCodes.length} QR code${newQRCodes.length > 1 ? 's' : ''} saved successfully.`);
    } catch (err) {
      console.error("Error saving QR codes:", err);
      toast.error("Failed to save QR codes.");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue={tabParam} className="space-y-6">
        <TabsList className="bg-white backdrop-blur-sm border border-gray-100 shadow-sm">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="customize">Appearance</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-medium mb-4">Quick Generate</h2>
              <QRCodeGenerator 
                onQRCodesGenerated={handleQRCodesGenerated}
                lastSequentialNumber={lastSequentialNumber}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-medium mb-4">Recent QR Codes</h2>
              <QRCodeManager limit={5} showActions={false} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="generate">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">QR Code Generator</h2>
            <QRCodeGenerator 
              onQRCodesGenerated={handleQRCodesGenerated}
              lastSequentialNumber={lastSequentialNumber}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">QR Code Manager</h2>
            <QRCodeManager />
          </div>
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="analytics">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Analytics</h2>
                <QRCodeAnalytics />
              </div>
            </TabsContent>
            
            <TabsContent value="customize">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Appearance</h2>
                <AppearanceSettings />
              </div>
            </TabsContent>
            
            <TabsContent value="team">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Team Management</h2>
                <UserManagement />
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Index;
