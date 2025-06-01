import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, RefreshCw, Eye, EyeOff, Search, X, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { QRCodeTemplatePreview } from './QRCodeTemplatePreview';
import { QRCode } from '@/types/qrCode';
import { formatSequentialNumber } from '@/utils/qrCodeUtils';
import { useAuth } from '@/contexts/AuthContext';

interface QRCodeManagerProps {
  qrCodes: QRCode[];
  onUpdateQRCode: (qrCode: QRCode) => void;
  onDeleteQRCode: (id: string) => void;
  onRefresh: () => void;
}

const QRCodeManager: React.FC<QRCodeManagerProps> = ({ qrCodes, onUpdateQRCode, onDeleteQRCode, onRefresh }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewQRCode, setPreviewQRCode] = useState<QRCode | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const { user } = useAuth();
  
  const handleToggleEnabled = async (qrCode: QRCode) => {
    try {
      const newStatus = !qrCode.isEnabled;
      
      const { error } = await supabase
        .from('qr_codes')
        .update({ is_enabled: newStatus })
        .eq('id', qrCode.id);
      
      if (error) {
        console.error('Error updating QR code status:', error);
        toast.error('Failed to update QR code status');
        return;
      }
      
      onUpdateQRCode({
        ...qrCode,
        isEnabled: newStatus
      });
      
      toast.success(`QR code ${newStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling QR code status:', error);
      toast.error('An error occurred while updating QR code status');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to delete QR codes');
      return;
    }
    
    setLoading(true);
    try {
      const { data: userLimitData, error: fetchLimitError } = await supabase
        .from('user_limits')
        .select('qr_created, monthly_qr_created')
        .eq('id', user.id)
        .single();

      if (fetchLimitError || !userLimitData) {
        console.error('Error fetching user limits before deletion:', fetchLimitError);
        toast.error('Failed to get user limits. QR code not deleted.');
        setLoading(false);
        return;
      }

      const { error: deleteError } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Error deleting QR code:', deleteError);
        toast.error('Failed to delete QR code');
        setLoading(false);
        return;
      }
      
      const updatedQrCreated = Math.max(0, userLimitData.qr_created - 1);
      const updatedMonthlyQrCreated = Math.max(0, userLimitData.monthly_qr_created - 1);

      const { error: updateLimitError } = await supabase
        .from('user_limits')
        .update({
          qr_created: updatedQrCreated,
          monthly_qr_created: updatedMonthlyQrCreated,
        })
        .eq('id', user.id);

      if (updateLimitError) {
        console.error('Error updating user limits after deletion:', updateLimitError);
        toast.warning('QR code deleted, but user limits failed to update.');
      }
      
      onDeleteQRCode(id);
      toast.success('QR code deleted successfully');
    } catch (error) {
      console.error('Error deleting QR code or updating limits:', error);
      toast.error('An error occurred during the deletion process');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('QR code list refreshed');
    } catch (error) {
      console.error('Error refreshing QR codes:', error);
      toast.error('An error occurred while refreshing QR codes');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const filteredQRCodes = qrCodes.filter(qr => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      qr.sequentialNumber.toString().includes(searchTerm) ||
      qr.id.toLowerCase().includes(searchLower) ||
      (qr.websiteUrl && qr.websiteUrl.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">QR Code Manager</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID or sequential number"
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQRCodes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      {searchTerm ? 'No QR codes match your search' : 'No QR codes available'}
                    </TableCell>
                  </TableRow>
                )}
                {filteredQRCodes.map((qrCode) => (
                  <TableRow key={qrCode.id}>
                    <TableCell className="font-mono text-xs truncate max-w-[120px]">
                      {qrCode.id}
                    </TableCell>
                    <TableCell>{formatSequentialNumber(Number(qrCode.sequentialNumber))}</TableCell>
                    <TableCell>
                      {qrCode.createdAt ? new Date(qrCode.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={qrCode.isEnabled}
                          onCheckedChange={() => handleToggleEnabled(qrCode)}
                        />
                        <span className={qrCode.isEnabled ? 'text-green-600' : 'text-red-600'}>
                          {qrCode.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {qrCode.isScanned ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            <span>Yes</span>
                            {qrCode.scannedAt && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({new Date(qrCode.scannedAt).toLocaleDateString()})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span>No</span>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setPreviewQRCode(qrCode)}
                        >
                          {qrCode.isScanned ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(qrCode.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!previewQRCode} onOpenChange={(open) => !open && setPreviewQRCode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Preview</DialogTitle>
          </DialogHeader>
          
          {previewQRCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-xs overflow-hidden rounded-lg shadow-md">
                <QRCodeTemplatePreview
                  template={previewQRCode.template || 'classic'}
                  qrCodeDataUrl={previewQRCode.dataUrl}
                  headerText={previewQRCode.headerText}
                  instructionText={previewQRCode.instructionText}
                  websiteUrl={previewQRCode.websiteUrl}
                  footerText={previewQRCode.footerText}
                  directionRTL={previewQRCode.directionRTL}
                />
              </div>
              
              <div className="w-full space-y-2 text-sm">
                <p><strong>ID:</strong> {previewQRCode.id}</p>
                <p><strong>Sequence Number:</strong> {formatSequentialNumber(Number(previewQRCode.sequentialNumber))}</p>
                <p><strong>Created:</strong> {previewQRCode.createdAt ? new Date(previewQRCode.createdAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Status:</strong> {previewQRCode.isEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Scanned:</strong> {previewQRCode.isScanned ? 'Yes' : 'No'}</p>
                {previewQRCode.isScanned && previewQRCode.scannedAt && (
                  <p><strong>Last Scanned:</strong> {new Date(previewQRCode.scannedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setPreviewQRCode(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeManager;
