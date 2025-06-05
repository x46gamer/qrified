import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from 'date-fns';
import { QRCode } from '@/types/qrCode'; // Import QRCode type
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanLog {
  id: string;
  created_at: string; // Creation date of the QR code
  scanned_at?: string; // Date of the latest scan
  scanned_ip?: string; // IP address from the latest scan
  scanned_isp?: string; // ISP from the latest scan
  scanned_city?: string; // City from the latest scan
  scanned_country?: string; // Country from the latest scan
  product_id?: string; // Foreign key to products
  product_name?: string; // Add the new product_name column
}

interface TopStat {
  value: string;
  count: number;
}

// Define sortable columns based on qr_codes table
const sortableColumns = [
  { value: 'created_at', label: 'Creation Time' }, // Changed from Scan Time to Creation Time
  { value: 'id', label: 'QR Code ID' }, // Changed from qr_code_id to id
  { value: 'scanned_at', label: 'Latest Scan Time' }, // Added latest scan time
  { value: 'scanned_ip', label: 'Latest Scan IP' },
  { value: 'scanned_isp', label: 'Latest Scan ISP' },
  { value: 'scanned_country', label: 'Latest Scan Country' },
  { value: 'scanned_city', label: 'Latest Scan City' },
  // user_agent is not directly on qr_codes table, remove from sortable if not available
  // { value: 'user_agent', label: 'User Agent' }, // Removed user agent as it's not in qr_codes
];

const ScanLogs = () => {
  const [qrCodesData, setQrCodesData] = useState<ScanLog[]>([]); // Renamed state to reflect QR code data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for statistics
  const [topDevices, setTopDevices] = useState<TopStat[]>([]); // Keep for now, might remove later
  const [topCities, setTopCities] = useState<TopStat[]>([]);
  const [topCountries, setTopCountries] = useState<TopStat[]>([]);

  // State for sorting
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('descending');

  useEffect(() => {
    fetchScanLogs();
  }, [sortBy, sortOrder]); // Refetch data when sort criteria change

  const fetchScanLogs = async () => {
    setIsLoading(true); // Set loading true before fetching
    setError(null); // Clear previous errors
    try {
      // Fetch data from the qr_codes table
      const { data, error } = await supabase
        .from('qr_codes') // Change table to qr_codes
        .select('id, created_at, scanned_at, scanned_ip, scanned_isp, scanned_city, scanned_country, product_id, product_name') // Select new product_name column, remove products(name)
        .order(sortBy, { ascending: sortOrder === 'ascending' }); // Apply sorting

      if (error) {
        console.error('Error fetching scan logs:', error);
        setError(error.message);
        toast.error('Failed to load scan logs.');
        setQrCodesData([]); // Clear data on error
      } else {
        // Map the data to the ScanLog interface (now representing QR code data)
        console.log('Fetched QR codes data:', data);
        setQrCodesData(data as ScanLog[]);
        
        // Log product data for debugging
        data.forEach((qrCode: any) => {
          console.log(`QR Code ID: ${qrCode.id}, Product ID: ${qrCode.product_id}, Product Name: ${qrCode.product_name}`);
        });

        // Only calculate stats if data is not empty
        if (data.length > 0) {
           // Pass the fetched QR code data for stats calculation
           calculateAndSetStats(data as ScanLog[]);
        } else {
           // Clear stats if no data
           setTopDevices([]);
           setTopCities([]);
           setTopCountries([]);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error fetching scan logs:', err);
      setError(err.message || 'An unexpected error occurred.');
      toast.error('An unexpected error occurred while loading scan logs.');
      setQrCodesData([]); // Clear data on unexpected error
      setTopDevices([]); // Clear stats
      setTopCities([]);
      setTopCountries([]);
    } finally {
      setIsLoading(false); // Set loading false after fetching (success or error)
    }
  };

  const calculateAndSetStats = (logs: ScanLog[]) => {
    const cityCounts: { [key: string]: number } = {};
    const countryCounts: { [key: string]: number } = {};

    logs.forEach(qrCode => {
      if (qrCode.scanned_city) {
        cityCounts[qrCode.scanned_city] = (cityCounts[qrCode.scanned_city] || 0) + 1;
      }
      if (qrCode.scanned_country) {
        countryCounts[qrCode.scanned_country] = (countryCounts[qrCode.scanned_country] || 0) + 1;
      }
    });

    const sortStats = (counts: { [key: string]: number }): TopStat[] => {
      return Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    };

    // Device stats are not available from qr_codes table directly, so set to empty
    setTopDevices([]);
    setTopCities(sortStats(cityCounts).slice(0, 5)); // Get top 5 cities
    setTopCountries(sortStats(countryCounts).slice(0, 5)); // Get top 5 countries
  };

  const handleSortChange = (value: string) => {
    // If changing column, reset order to descending, otherwise toggle order
    if (value === sortBy) {
      setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortBy(value);
      setSortOrder('descending'); // Default to descending for new column
    }
  };

  const handleExportCsv = () => {
    if (qrCodesData.length === 0) {
      toast.info('No data to export.');
      return;
    }

    const headers = ['QR Code ID', 'Creation Time', 'Latest Scan Time', 'Latest Scan IP', 'Latest Scan ISP', 'Latest Scan Country', 'Latest Scan City', 'Product Name'];
    // Add headers for QR code data if you decide to show them
    // headers.push('QR Code URL', 'QR Code Header', 'QR Code Instruction', ...);

    const rows = qrCodesData.map(qrCode => [
      `"${qrCode.id}"`, // QR Code ID (keeping ID first for easier lookup in CSV)
      format(new Date(qrCode.created_at), 'yyyy-MM-dd HH:mm:ss'),
      qrCode.scanned_at ? format(new Date(qrCode.scanned_at), 'yyyy-MM-dd HH:mm:ss') : '', // Latest Scan Time
      qrCode.scanned_ip || '',
      qrCode.scanned_isp || '',
      qrCode.scanned_country || '',
      qrCode.scanned_city || '',
      qrCode.product_name || '' // Use the new product_name column
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'scan_logs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Scan logs exported as CSV.');
  };

  if (isLoading && qrCodesData.length === 0) { // Show loading only on initial load
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <span className="ml-4 text-lg text-gray-600">Loading scan logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading scan logs: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Scan Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Top Devices</h4>
            <ul>
              {topDevices.length === 0 ? (<li>No data available</li>) : (topDevices.map(stat => (
                <li key={stat.value} className="text-sm text-gray-700">{stat.value}: {stat.count} scans</li>
              )))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Top Cities</h4>
            <ul>
              {topCities.length === 0 ? (<li>No data available</li>) : (topCities.map(stat => (
                <li key={stat.value} className="text-sm text-gray-700">{stat.value}: {stat.count} scans</li>
              )))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Top Countries</h4>
            <ul>
              {topCountries.length === 0 ? (<li>No data available</li>) : (topCountries.map(stat => (
                <li key={stat.value} className="text-sm text-gray-700">{stat.value}: {stat.count} scans</li>
              )))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Scan Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select onValueChange={handleSortChange} value={sortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {sortableColumns.map(column => (
                    <SelectItem key={column.value} value={column.value}>
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Add sort order indicator */}
              {sortBy && (
                <span className="text-sm text-gray-500 flex items-center">
                  {sortOrder === 'ascending' ? '↑' : '↓'}
                </span>
              )}
            </div>
            <Button onClick={handleExportCsv} size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>QR Code ID</TableHead>
                <TableHead>Creation Time</TableHead>
                <TableHead>Latest Scan Time</TableHead>
                <TableHead>Latest Scan IP</TableHead>
                <TableHead>Latest Scan ISP</TableHead>
                <TableHead>Latest Scan Country</TableHead>
                <TableHead>Latest Scan City</TableHead>
                <TableHead>Product Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && qrCodesData.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={8} className="text-center">
                     <div className="flex justify-center items-center">
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                       Loading scan logs...
                     </div>
                   </TableCell>
                 </TableRow>
              ) : qrCodesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No scan logs found.
                  </TableCell>
                </TableRow>
              ) : (
                qrCodesData.map(qrCode => (
                  <TableRow key={qrCode.id}>
                    <TableCell>{qrCode.id}</TableCell>
                    <TableCell>{format(new Date(qrCode.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                    <TableCell>{qrCode.scanned_at ? format(new Date(qrCode.scanned_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                    <TableCell>{qrCode.scanned_ip || 'N/A'}</TableCell>
                    <TableCell>{qrCode.scanned_isp || 'N/A'}</TableCell>
                    <TableCell>{qrCode.scanned_country || 'N/A'}</TableCell>
                    <TableCell>{qrCode.scanned_city || 'N/A'}</TableCell>
                    <TableCell>{qrCode.product_name || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanLogs; 