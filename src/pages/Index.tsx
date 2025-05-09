
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRCodeManager from '@/components/QRCodeManager';
import QRCodeAnalytics from '@/components/QRCodeAnalytics';
import UserManagement from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QRCode, QRCodeData } from '@/types/qrCode';
import { toast } from 'sonner';
import AppearanceSettings from '@/components/AppearanceSettings';
import { v4 as uuidv4 } from 'uuid';

// Define a simplified QR code structure for database operations
interface QRCodeDBRecord {
  id: string;
  user_id: string;
  data: QRCodeData;
  created_at: string;
  scans: number;
}

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'dashboard';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [lastSequentialNumber, setLastSequentialNumber] = useState<number>(0);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch QR codes for display
  const fetchQRCodes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setQrCodes(data as unknown as QRCode[]);
      }
    } catch (err) {
      console.error("Error fetching QR codes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [user]);

  useEffect(() => {
    const fetchLastSequentialNumber = async () => {
      if (!user) return;
      
      try {
        // Find the highest sequential number used in existing QR codes
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const numbers = data
            .map(item => {
              if (item.sequential_number) {
                const num = parseInt(item.sequential_number);
                return !isNaN(num) ? num : 0;
              }
              return 0;
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
      // Prepare records for database insert
      const dbRecords = newQRCodes.map(code => {
        // Generate sequential number if needed
        const sequentialNumber = code.data?.uniqueId || uuidv4().substring(0, 8);
        
        return {
          id: code.id,
          user_id: user.id,
          sequential_number: sequentialNumber,
          encrypted_data: code.encryptedData || 'encrypted_placeholder',
          url: code.url || code.data?.text || `https://seqrity.com/check?id=${sequentialNumber}`,
          is_scanned: false,
          is_enabled: true,
          created_at: new Date().toISOString(),
          template: code.data?.template || 'modern',
          data_url: code.dataUrl || '',
          header_text: code.headerText || '',
          instruction_text: code.instructionText || '',
          website_url: code.websiteUrl || '',
          footer_text: code.footerText || '',
        };
      });
      
      // Save the new QR codes to the database
      const { error } = await supabase.from('qr_codes').insert(dbRecords);
      
      if (error) throw error;
      
      // Refresh the QR codes list
      fetchQRCodes();
      
      // Update the last sequential number
      const newNumbers = newQRCodes
        .map(code => {
          const uniqueId = code.data?.uniqueId;
          if (!uniqueId) return 0;
          
          const num = parseInt(uniqueId);
          return !isNaN(num) ? num : 0;
        })
        .filter(num => num > 0);
      
      if (newNumbers.length > 0) {
        setLastSequentialNumber(prevNum => Math.max(prevNum, Math.max(...newNumbers)));
      }
      
      toast.success(`${newQRCodes.length} QR code${newQRCodes.length > 1 ? 's' : ''} saved successfully.`);
    } catch (err) {
      console.error("Error saving QR codes:", err);
      toast.error("Failed to save QR codes.");
    }
  };

  const handleUpdateQRCode = async (updatedQRCode: QRCode) => {
    // Implement update logic
    console.log("Update QR code:", updatedQRCode);
  };

  const handleDeleteQRCode = async (id: string) => {
    // Implement delete logic
    console.log("Delete QR code:", id);
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
              <QRCodeManager 
                qrCodes={qrCodes.slice(0, 5)}
                onUpdateQRCode={handleUpdateQRCode}
                onDeleteQRCode={handleDeleteQRCode}
                onRefresh={fetchQRCodes}
                showActions={false}
              />
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
            <QRCodeManager 
              qrCodes={qrCodes}
              onUpdateQRCode={handleUpdateQRCode}
              onDeleteQRCode={handleDeleteQRCode}
              onRefresh={fetchQRCodes}
            />
          </div>
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="analytics">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-medium mb-4">Analytics</h2>
                <QRCodeAnalytics qrCodes={qrCodes} />
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
