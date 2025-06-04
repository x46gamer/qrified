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
  created_at: string;
  qr_code_id: string;
  ip_address?: string;
  isp?: string;
  location?: string; // Adjust if your column name is different (e.g., scanned_location)
  city?: string;
  country?: string;
  user_agent?: string;
  // Add the nested qr_codes relationship
  qr_codes?: QRCode | null;
}

interface TopStat {
  value: string;
  count: number;
}

// Define sortable columns
const sortableColumns = [
  { value: 'created_at', label: 'Scan Time' },
  { value: 'qr_code_id', label: 'QR Code ID' },
  { value: 'ip_address', label: 'IP Address' },
  { value: 'isp', label: 'ISP' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'user_agent', label: 'User Agent' },
];

const ScanLogs = () => {
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for statistics
  const [topDevices, setTopDevices] = useState<TopStat[]>([]);
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
      const { data, error } = await supabase
        .from('scan_logs')
        .select('*, qr_codes(*)') // Select all from scan_logs and join qr_codes
        .order(sortBy, { ascending: sortOrder === 'ascending' }); // Apply sorting

      if (error) {
        console.error('Error fetching scan logs:', error);
        setError(error.message);
        toast.error('Failed to load scan logs.');
        setScanLogs([]); // Clear logs on error
      } else {
        // Map the data to the ScanLog interface, adjusting column names if necessary
        const mappedLogs: ScanLog[] = data.map(log => ({
          id: log.id,
          created_at: log.created_at,
          qr_code_id: log.qr_code_id,
          // Adjust these based on your actual database column names
          ip_address: log.ip_address || log.scanned_ip || 'N/A', // Assuming one of these is used
          isp: log.isp || log.scanned_isp || 'N/A',
          location: log.location || log.scanned_location || 'N/A', // Assuming one of these is used
          city: log.city || log.scanned_city || 'N/A',
          country: log.country || log.scanned_country || 'N/A',
          user_agent: log.user_agent || 'N/A',
          qr_codes: log.qr_codes as QRCode | null, // Map the nested data
        }));
        setScanLogs(mappedLogs);
        // Only calculate stats if data is not empty
        if (mappedLogs.length > 0) {
           calculateAndSetStats(mappedLogs);
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
      setScanLogs([]); // Clear logs on unexpected error
      setTopDevices([]); // Clear stats
      setTopCities([]);
      setTopCountries([]);
    } finally {
      setIsLoading(false); // Set loading false after fetching (success or error)
    }
  };

  const calculateAndSetStats = (logs: ScanLog[]) => {
    const deviceCounts: { [key: string]: number } = {};
    const cityCounts: { [key: string]: number } = {};
    const countryCounts: { [key: string]: number } = {};

    logs.forEach(log => {
      // Simple user agent parsing for device type (can be improved)
      const device = log.user_agent ? (log.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop') : 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;

      const city = log.city && log.city !== 'N/A' ? log.city : 'Unknown City';
      cityCounts[city] = (cityCounts[city] || 0) + 1;

      const country = log.country && log.country !== 'N/A' ? log.country : 'Unknown Country';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const sortStats = (counts: { [key: string]: number }): TopStat[] => {
      return Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    };

    setTopDevices(sortStats(deviceCounts).slice(0, 5)); // Get top 5
    setTopCities(sortStats(cityCounts).slice(0, 5)); // Get top 5
    setTopCountries(sortStats(countryCounts).slice(0, 5)); // Get top 5
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
    if (scanLogs.length === 0) {
      toast.info('No data to export.');
      return;
    }

    const headers = ['Scan Time', 'QR Code ID', 'IP Address', 'ISP', 'Country', 'City', 'User Agent'];
    // Add headers for QR code data if you decide to show them
    // headers.push('QR Code URL', 'QR Code Header', 'QR Code Instruction', ...);

    const rows = scanLogs.map(log => [
      format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
      `"${log.qr_code_id}"`, // Enclose in quotes to handle commas if any
      log.ip_address,
      log.isp,
      log.country,
      log.city,
      `"${log.user_agent}"`, // Enclose in quotes
      // Add data from QR code relationship if needed
      // log.qr_codes?.url || '', log.qr_codes?.headerText || '', log.qr_codes?.instructionText || '', ...
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

  if (isLoading && scanLogs.length === 0) { // Show loading only on initial load
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
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
              <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')}>
                <ArrowUpDown className={cn("h-4 w-4", sortOrder === 'descending' ? 'rotate-180' : '')} />
                <span className="sr-only">Toggle sort order</span>
              </Button>
            </div>
            <Button onClick={handleExportCsv} disabled={scanLogs.length === 0}>
              Export CSV
            </Button>
          </div>
          {isLoading && scanLogs.length > 0 && ( // Show loading spinner above table when refreshing data
             <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan Time</TableHead>
                  <TableHead>QR Code ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>ISP</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>User Agent</TableHead>
                  {/* Add columns for QR code data here later */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No scan logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  scanLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[120px]">{log.qr_code_id}</TableCell>
                      <TableCell>{log.ip_address}</TableCell>
                      <TableCell>{log.isp}</TableCell>
                      <TableCell>{log.country}</TableCell>
                      <TableCell>{log.city}</TableCell>
                      <TableCell className="text-xs truncate max-w-[200px]">{log.user_agent}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanLogs; 