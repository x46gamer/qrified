import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
  
  const [selectedQrCodeIds, setSelectedQrCodeIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState<boolean>(false);
  const [isBatchDisabling, setIsBatchDisabling] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const qrCodesPerPage = 10;

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
      
      onDeleteQRCode(id);
      toast.success('QR code deleted successfully');
    } catch (error) {
      console.error('Error deleting QR code or updating limits:', error);
      toast.error('An error occurred during the deletion process');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQrCodeIds.size === 0) {
      toast.info('No QR codes selected for deletion.');
      return;
    }
  
    if (!user) {
      toast.error('You must be logged in to delete QR codes');
      return;
    }
  
    setIsBatchDeleting(true);
    let initialUserLimits: { qr_created: number; monthly_qr_created: number } | null = null;
    
    try {
      const { data: userLimitData, error: fetchLimitError } = await supabase
        .from('user_limits')
        .select('qr_created, monthly_qr_created')
        .eq('id', user.id)
        .single();

      if (fetchLimitError || !userLimitData) {
        console.error('Error fetching user limits before batch deletion:', fetchLimitError);
        toast.error('Failed to get user limits. Deletion aborted.');
        setIsBatchDeleting(false);
        return;
      }
      initialUserLimits = userLimitData;

      const idsToDelete = Array.from(selectedQrCodeIds);
      const { error: deleteError } = await supabase
        .from('qr_codes')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('Error batch deleting QR codes:', deleteError);
        toast.error(`Failed to delete selected QR codes: ${deleteError.message}`);
      } else {
        const SucceededCount = idsToDelete.length;
        
        idsToDelete.forEach(id => onDeleteQRCode(id)); 
  
        toast.success(`${SucceededCount} QR code(s) deleted successfully.`);
      }
    } catch (error: any) {
        console.error('Unexpected error during batch deletion process:', error);
        toast.error(`An unexpected error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setSelectedQrCodeIds(new Set());
      setIsBatchDeleting(false);
    }
  };
  
  const handleDisableSelected = async () => {
    if (selectedQrCodeIds.size === 0) {
      toast.info('No QR codes selected for disabling.');
      return;
    }
  
    setIsBatchDisabling(true);
    let SucceededCount = 0;
    const errors: string[] = [];
  
    for (const id of Array.from(selectedQrCodeIds)) { 
      const qrCodeToUpdate = qrCodes.find(qr => qr.id === id);
      if (!qrCodeToUpdate) {
          errors.push(`QR code ${id} not found.`);
          continue;
      }
      if (!qrCodeToUpdate.isEnabled) { 
        continue;
      }
  
      try {
        const { error } = await supabase
          .from('qr_codes')
          .update({ is_enabled: false })
          .eq('id', id);
  
        if (error) {
          console.error(`Error disabling QR code ${id}:`, error);
          errors.push(`Failed to disable QR code ${id}.`);
        } else {
          onUpdateQRCode({ ...qrCodeToUpdate, isEnabled: false });
          SucceededCount++;
        }
      } catch (error: any) {
        console.error(`Error processing disable for QR code ${id}:`, error);
        errors.push(`Error disabling QR code ${id}.`);
      }
    }
  
    if (SucceededCount > 0) {
      toast.success(`${SucceededCount} QR code(s) disabled successfully.`);
    }
    if (errors.length > 0) {
      toast.error(`${errors.length} QR code(s) failed to disable. ${errors.join(' ')}`);
    }
    if (SucceededCount === 0 && errors.length === 0 && selectedQrCodeIds.size > 0) {
        toast.info('No QR codes were disabled. They might have been already disabled or not found.');
    }
  
    setSelectedQrCodeIds(new Set());
    setIsBatchDisabling(false);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSelectedQrCodeIds(new Set()); 
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
      (qr.websiteUrl && qr.websiteUrl.toLowerCase().includes(searchLower)) ||
      (qr.product?.name && qr.product.name.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    const currentFilteredIds = new Set(filteredQRCodes.map(qr => qr.id));
    const newSelectedIds = new Set<string>();
    let selectionChanged = false;
    selectedQrCodeIds.forEach(id => {
      if (currentFilteredIds.has(id)) {
        newSelectedIds.add(id);
      } else {
        selectionChanged = true;
      }
    });
    if (selectionChanged || newSelectedIds.size !== selectedQrCodeIds.size) {
      setSelectedQrCodeIds(newSelectedIds);
    }
  }, [filteredQRCodes, selectedQrCodeIds]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allFilteredIds = new Set(filteredQRCodes.map(qr => qr.id));
      setSelectedQrCodeIds(allFilteredIds);
    } else {
      setSelectedQrCodeIds(new Set());
    }
  };
  
  const isAllFilteredSelected = filteredQRCodes.length > 0 && selectedQrCodeIds.size === filteredQRCodes.length;
  const isSomeFilteredSelected = selectedQrCodeIds.size > 0 && selectedQrCodeIds.size < filteredQRCodes.length;
  
  const paginatedQRCodes = filteredQRCodes.slice((currentPage - 1) * qrCodesPerPage, currentPage * qrCodesPerPage);
  const totalPages = Math.ceil(filteredQRCodes.length / qrCodesPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">QR Code Manager</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isRefreshing || isBatchDeleting || isBatchDisabling}
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
          placeholder={`Search ${qrCodes.length} QR codes by ID, sequence, or URL...`}
          className="pl-10 pr-10"
          disabled={isBatchDeleting || isBatchDisabling}
        />
        {searchTerm && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>

      {selectedQrCodeIds.size > 0 && (
        <div className="flex items-center space-x-2 my-4 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">{selectedQrCodeIds.size} selected</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={isBatchDeleting || isBatchDisabling || loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
            {isBatchDeleting && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisableSelected}
            disabled={isBatchDisabling || isBatchDeleting}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Disable Selected
            {isBatchDisabling && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
        </div>
      )}
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllFilteredSelected ? true : (isSomeFilteredSelected ? 'indeterminate' : false) }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                      disabled={filteredQRCodes.length === 0 || isBatchDeleting || isBatchDisabling}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQRCodes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      {searchTerm ? 'No QR codes match your search.' : 'No QR codes available.'}
                    </TableCell>
                  </TableRow>
                )}
                {paginatedQRCodes.map((qrCode) => (
                  <TableRow 
                    key={qrCode.id}
                    data-state={selectedQrCodeIds.has(qrCode.id) ? 'selected' : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedQrCodeIds.has(qrCode.id)}
                        onCheckedChange={(checked) => {
                          const newSelectedIds = new Set(selectedQrCodeIds);
                          if (checked) {
                            newSelectedIds.add(qrCode.id);
                          } else {
                            newSelectedIds.delete(qrCode.id);
                          }
                          setSelectedQrCodeIds(newSelectedIds);
                        }}
                        aria-label={`Select row ${qrCode.id}`}
                        disabled={isBatchDeleting || isBatchDisabling}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[100px] sm:max-w-[120px]">
                      {qrCode.id}
                    </TableCell>
                    <TableCell>{formatSequentialNumber(Number(qrCode.sequentialNumber))}</TableCell>
                    <TableCell>{qrCode.product?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {qrCode.createdAt ? new Date(qrCode.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={qrCode.isEnabled}
                          onCheckedChange={() => handleToggleEnabled(qrCode)}
                          disabled={isBatchDeleting || isBatchDisabling}
                          aria-label={qrCode.isEnabled ? 'Disable QR Code' : 'Enable QR Code'}
                        />
                        <span className={qrCode.isEnabled ? 'text-green-600' : 'text-red-600'}>
                          {qrCode.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {qrCode.isScanned ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-amber-600" />
                        )}
                        <span>{qrCode.isScanned ? 'Yes' : 'No'}</span>
                        {qrCode.isScanned && qrCode.scannedAt && (
                          <span className="ml-1 text-xs text-muted-foreground hidden sm:inline">
                                ({new Date(qrCode.scannedAt).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setPreviewQRCode(qrCode)}
                          disabled={isBatchDeleting || isBatchDisabling}
                          title="Preview QR Code"
                        >
                          <Eye className="h-4 w-4" /> 
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(qrCode.id)}
                          disabled={loading || isBatchDeleting || isBatchDisabling} 
                          title="Delete QR Code"
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
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-muted-foreground">
            Showing {paginatedQRCodes.length} of {filteredQRCodes.length} QR codes
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => handlePageChange(i + 1)} 
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
      
      <Dialog open={!!previewQRCode} onOpenChange={(open) => !open && setPreviewQRCode(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code Preview</DialogTitle>
          </DialogHeader>
          
          {previewQRCode && (
            <div className="grid gap-4 py-4">
              <div className="w-full space-y-1 text-sm bg-muted p-3 rounded-md">
                <p><strong>ID:</strong> <span className="font-mono text-xs">{previewQRCode.id}</span></p>
                <p><strong>Sequence:</strong> {formatSequentialNumber(Number(previewQRCode.sequentialNumber))}</p>
                <p><strong>Product:</strong> {previewQRCode.product?.name || 'N/A'}</p>
                <p><strong>Created:</strong> {previewQRCode.createdAt ? new Date(previewQRCode.createdAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Status:</strong> {previewQRCode.isEnabled ? 
                  <span className="text-green-600 font-medium">Enabled</span> : 
                  <span className="text-red-600 font-medium">Disabled</span>}
                </p>
                <p><strong>Scanned:</strong> {previewQRCode.isScanned ? 
                  <span className="text-green-600 font-medium">Yes</span> : 
                  <span className="text-amber-600 font-medium">No</span>}
                </p>
                {previewQRCode.isScanned && previewQRCode.scannedAt && (
                  <p><strong>Last Scanned:</strong> {new Date(previewQRCode.scannedAt).toLocaleString()}</p>
                )}
                 {previewQRCode.websiteUrl && (
                  <p><strong>URL:</strong> <a href={previewQRCode.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{previewQRCode.websiteUrl}</a></p>
                )}

                {/* Display Scan Details if scanned */}
                {previewQRCode.isScanned && previewQRCode.scannedAt && (
                  <>
                    <h4 className="font-semibold mt-4 mb-2">Scan Details:</h4>
                    <p><strong>IP:</strong> {previewQRCode.scannedIp || 'N/A'}</p>
                    <p><strong>ISP:</strong> {previewQRCode.scannedIsp || 'N/A'}</p>
                    <p><strong>Location:</strong> {previewQRCode.scannedCity && previewQRCode.scannedCountry ? 
                      `${previewQRCode.scannedCity}, ${previewQRCode.scannedCountry}` : 
                      'N/A'}</p>
                  </>
                )}
              </div>
              <QRCodeTemplatePreview
                template={previewQRCode.template}
                headerText={previewQRCode.headerText}
                instructionText={previewQRCode.instructionText}
                websiteUrl={previewQRCode.websiteUrl}
                footerText={previewQRCode.footerText}
                directionRtl={previewQRCode.directionRtl}
                dataUrl={previewQRCode.dataUrl}
                text={previewQRCode.text}
              />
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
