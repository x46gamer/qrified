import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { QRCode } from '@/types/qrCode';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye } from "lucide-react";
import { generateQRCode } from '@/utils/qrCodeUtils';

interface QRCodeManagerProps {
  qrCodes: QRCode[];
  onUpdateQRCode: (qrCode: QRCode) => void;
  onRefresh: () => void;
}

const QRCodeManager = ({ qrCodes, onUpdateQRCode, onRefresh }: QRCodeManagerProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  const filteredQRCodes = qrCodes.filter((qrCode) => 
    qrCode.sequentialNumber.includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredQRCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQRCodes = filteredQRCodes.slice(startIndex, startIndex + itemsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleToggleEnabled = async (qrCode: QRCode) => {
    const updatedQRCode = { ...qrCode, isEnabled: !qrCode.isEnabled };
    
    // Update in the database
    const { error } = await supabase
      .from('qr_codes')
      .update({ is_enabled: updatedQRCode.isEnabled })
      .eq('id', qrCode.id);
    
    if (error) {
      console.error('Error updating QR code:', error);
      toast.error(`Failed to ${updatedQRCode.isEnabled ? 'enable' : 'disable'} QR Code`);
      return;
    }
    
    onUpdateQRCode(updatedQRCode);
    toast.success(`QR Code #${qrCode.sequentialNumber} ${updatedQRCode.isEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const resetQRCode = async (qrCode: QRCode) => {
    const updatedQRCode = { ...qrCode, isScanned: false, scannedAt: undefined };
    
    // Update in the database
    const { error } = await supabase
      .from('qr_codes')
      .update({ 
        is_scanned: false,
        scanned_at: null
      })
      .eq('id', qrCode.id);
    
    if (error) {
      console.error('Error resetting QR code:', error);
      toast.error('Failed to reset QR Code');
      return;
    }
    
    onUpdateQRCode(updatedQRCode);
    toast.success(`QR Code #${qrCode.sequentialNumber} reset successfully`);
  };

  const handlePreviewQRCode = async (qrCode: QRCode) => {
    setSelectedQRCode(qrCode);

    try {
      // If we already have a data URL stored, use it
      if (qrCode.dataUrl) {
        setPreviewUrl(qrCode.dataUrl);
      } else {
        // Otherwise, regenerate the QR code
        // Use the URL as the data for the QR code
        const generatedUrl = await generateQRCode(qrCode.url);
        setPreviewUrl(generatedUrl);
      }
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating QR code preview:', error);
      toast.error('Failed to generate QR code preview');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">QR Code Management</h2>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scanned</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedQRCodes.length > 0 ? (
              paginatedQRCodes.map((qrCode) => (
                <TableRow key={qrCode.id}>
                  <TableCell className="font-medium">{qrCode.sequentialNumber}</TableCell>
                  <TableCell>
                    {qrCode.isScanned ? (
                      <Badge variant="outline" className="bg-counterfeit/10 text-counterfeit">Scanned</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-verified/10 text-verified">New</Badge>
                    )}
                  </TableCell>
                  <TableCell>{qrCode.scannedAt ? new Date(qrCode.scannedAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{new Date(qrCode.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`enable-${qrCode.id}`}
                        checked={qrCode.isEnabled}
                        onCheckedChange={() => handleToggleEnabled(qrCode)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewQRCode(qrCode)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      {qrCode.isScanned && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetQRCode(qrCode)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No QR codes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Button 
          variant="outline"
          onClick={onRefresh}
          size="sm"
        >
          Refresh Data
        </Button>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* QR Code Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code #{selectedQRCode?.sequentialNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
            {previewUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <img 
                  src={previewUrl} 
                  alt={`QR Code ${selectedQRCode?.sequentialNumber}`} 
                  className="w-64 h-64 object-contain border border-gray-200 p-2 rounded-lg" 
                />
                <div className="text-sm text-gray-500">
                  <p>ID: {selectedQRCode?.id}</p>
                  <p>Created: {selectedQRCode?.createdAt && new Date(selectedQRCode.createdAt).toLocaleString()}</p>
                  {selectedQRCode?.isScanned && selectedQRCode?.scannedAt && (
                    <p>Scanned: {new Date(selectedQRCode.scannedAt).toLocaleString()}</p>
                  )}
                  <p>Status: {selectedQRCode?.isEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center border border-gray-200 rounded-lg">
                <p className="text-gray-400">Loading QR code...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeManager;
