
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QRCode } from '@/types/qrCode';
import { toast } from "sonner";

interface QRCodeManagerProps {
  qrCodes: QRCode[];
  onUpdateQRCode: (qrCode: QRCode) => void;
}

const QRCodeManager = ({ qrCodes, onUpdateQRCode }: QRCodeManagerProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
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
  
  const handleToggleEnabled = (qrCode: QRCode) => {
    const updatedQRCode = { ...qrCode, isEnabled: !qrCode.isEnabled };
    onUpdateQRCode(updatedQRCode);
    toast.success(`QR Code #${qrCode.sequentialNumber} ${updatedQRCode.isEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const resetQRCode = (qrCode: QRCode) => {
    const updatedQRCode = { ...qrCode, isScanned: false, scannedAt: undefined };
    onUpdateQRCode(updatedQRCode);
    toast.success(`QR Code #${qrCode.sequentialNumber} reset successfully`);
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
                    {qrCode.isScanned && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetQRCode(qrCode)}
                      >
                        Reset
                      </Button>
                    )}
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
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
  );
};

export default QRCodeManager;
