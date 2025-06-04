import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Button } from '../components/ui/button';
import { Save, RefreshCw, Star, MapPin, Globe, Clock, CheckCircle2, XCircle, MessageSquare, QrCode, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QRCode } from '@/types/qrCode';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
);

// Mock data
const mostScannedProducts = [
  { name: 'Product A', scans: 120 },
  { name: 'Product B', scans: 95 },
  { name: 'Product C', scans: 80 },
];

const mostScanningCities = [
  { city: 'New York', scans: 60 },
  { city: 'London', scans: 45 },
  { city: 'Tokyo', scans: 30 },
];

const mostScanningCountries = [
  { country: 'USA', scans: 100 },
  { country: 'UK', scans: 60 },
  { country: 'Japan', scans: 40 },
];

const peakHoursData = {
  labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
  datasets: [
    {
      label: 'Scans',
      data: [5, 20, 40, 30, 50, 35, 10],
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      caretSize: 5,
      cornerRadius: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: '#6B7280',
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
    },
    x: {
      ticks: {
        color: '#6B7280',
        callback: function(value, index, values) {
          const hour = parseInt(this.getLabelForValue(value).replace('h', ''));
          if (hour === 0) return '12 AM';
          if (hour === 4) return '4 AM';
          if (hour === 8) return '8 AM';
          if (hour === 12) return '12 PM';
          if (hour === 16) return '4 PM';
          if (hour === 20) return '8 PM';
          return '';
        },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.1)',
      },
    },
  },
  elements: {
    line: {
      tension: 0.3,
    },
    point: {
      radius: 0,
    },
  },
};

const initialLatestScans = [
  { product: 'Product A', city: 'New York', country: 'USA', time: '2024-06-10 14:23', qrCode: 'QR12345', status: 'success' },
  { product: 'Product B', city: 'London', country: 'UK', time: '2024-06-10 13:50', qrCode: 'QR67890', status: 'failed' },
  { product: 'Product C', city: 'Tokyo', country: 'Japan', time: '2024-06-10 13:30', qrCode: 'QR54321', status: 'failed' }
];

const bestReviews = [
  { product: 'Product A', review: 'Excellent quality!', rating: 5 },
  { product: 'Product C', review: 'Very reliable.', rating: 4.5 },
];

const mostScannedQRCodes = [
  { code: 'QR12345', unsuccessful: 15, warning: true },
  { code: 'QR67890', unsuccessful: 8, warning: false },
  { code: 'QR54321', unsuccessful: 12, warning: true },
];

const Dashboard = () => {
  const [latestScansData, setLatestScansData] = useState<any[]>([]);
  const [peakHoursChartData, setPeakHoursChartData] = useState<any>({
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: 'Scans',
        data: Array.from({ length: 24 }, () => 0),
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  });
  const { user } = useAuth();
  const [bestReviews, setBestReviews] = useState<Array<{
    product: string;
    review: string;
    rating: number;
  }>>([]);

  const [mostScannedQRCodes, setMostScannedQRCodes] = useState<{
    code: string;
    unsuccessful: number;
    warning: boolean;
  }[]>([]); // State for suspicious QR codes

  // Add state variables for cities and countries
  const [mostScanningCitiesData, setMostScanningCitiesData] = useState<{
    city: string;
    scans: number;
  }[]>([]);
  const [mostScanningCountriesData, setMostScanningCountriesData] = useState<{
    country: string;
    scans: number;
  }[]>([]);

  // Fetch and process scan data for various dashboard sections
  useEffect(() => {
    const fetchAndProcessScanData = async () => {
      if (!user) return; // Don't fetch if user is not logged in

      try {
        // Fetch all scanned QR codes for the user
        const { data: scannedQRCodes, error: fetchError } = await supabase
          .from('qr_codes')
          .select('scanned_at, scanned_city, scanned_country, sequential_number, is_scanned, id, product_id, products(name), failed_scan_attempts') // Select failed_scan_attempts
          .eq('is_scanned', true) // Only get successfully scanned codes
          .eq('user_id', user.id); // Filter for current user's QR codes

        if (fetchError) {
          console.error('Error fetching scanned QR codes:', fetchError);
          // Optionally set error state for the user
          return;
        }

        if (!scannedQRCodes) {
          setLatestScansData([]);
          // Set peak hours data to all zeros if no scans
          setPeakHoursChartData({
            labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
            datasets: [
              {
                label: 'Scans',
                data: Array.from({ length: 24 }, () => 0),
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
            ],
          });
          return;
        }

        // --- Process data for Latest Scans ---
        // Ensure scannedQRCodes is treated as an array of potential QR codes
        const validScans = scannedQRCodes ? (scannedQRCodes as Partial<QRCode>[]).filter(scan => scan && scan.id) : [];

        const latestScans = validScans
          .sort((a, b) => new Date((b as any).scanned_at).getTime() - new Date((a as any).scanned_at).getTime())
          .slice(0, 3) as QRCode[]; // Cast to QRCode[] after filtering

        const formattedLatestScans = latestScans.map(scan => {
          const formattedSequentialNumber = String(scan.sequential_number).padStart(6, '0');
          return {
            product: scan.product?.name || `QR ${formattedSequentialNumber}`, // Use product name if available
            city: scan.scanned_city || 'N/A', // Use fetched city data
            country: scan.scanned_country || 'N/A', // Use fetched country data
            time: scan.scanned_at ? new Date(scan.scanned_at).toLocaleString() : 'N/A', // Format scanned_at
            qrCode: formattedSequentialNumber, // Use formatted sequential number for QR code display
            status: scan.is_scanned ? 'success' : 'failed', // Status based on is_scanned
          };
        });
        setLatestScansData(formattedLatestScans);

        // --- Process data for Peak Hours ---
        const hourlyScanCounts = Array.from({ length: 24 }, () => 0); // Array to hold counts for hours 0-23

        validScans.forEach(scan => {
          if ((scan as any).scanned_at) { // Cast to any temporarily for date parsing
            try {
              const scanDate = new Date((scan as any).scanned_at);
              const hour = scanDate.getHours(); // Get the hour (0-23)
              if (hour >= 0 && hour < 24) {
                hourlyScanCounts[hour]++;
              }
            } catch (dateError) {
              console.error('Error parsing scanned_at date:', dateError, (scan as any).scanned_at);
            }
          }
        });

        // Update the peak hours chart data state
        setPeakHoursChartData({
          labels: Array.from({ length: 24 }, (_, i) => `${i}h`), // Labels for 0h to 23h
          datasets: [
            {
              label: 'Scans',
              data: hourlyScanCounts,
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
            },
          ],
        });

        // --- Process data for Suspicious QR Codes ---
        const suspiciousQRCodes = (validScans as QRCode[]) // Cast to QRCode[] after filtering
          .filter(qr => qr.failed_scan_attempts && qr.failed_scan_attempts > 0) // Filter for QRs with failed attempts
          .sort((a, b) => (b.failed_scan_attempts || 0) - (a.failed_scan_attempts || 0)) // Sort by failed attempts descending
          .map(qr => ({
            code: String(qr.sequential_number).padStart(6, '0'),
            unsuccessful: qr.failed_scan_attempts || 0,
            warning: (qr.failed_scan_attempts || 0) > 10, // Set warning to true only if failed attempts > 10
          }));

        // Update the state for suspicious QR codes (assuming a state variable for this exists or will be added)
        setMostScannedQRCodes(suspiciousQRCodes); // Using existing state for now

        // --- Process data for Cities and Countries ---
        const cityCounts: { [key: string]: number } = {};
        const countryCounts: { [key: string]: number } = {};

        // Ensure scannedQRCodes is treated as an array of potential QR codes
        validScans.forEach(scan => {
          if (scan.scanned_city) {
            cityCounts[scan.scanned_city] = (cityCounts[scan.scanned_city] || 0) + 1;
          }
          if (scan.scanned_country) {
            countryCounts[scan.scanned_country] = (countryCounts[scan.scanned_country] || 0) + 1;
          }
        });

        // Convert counts to sorted arrays
        const sortedCities = Object.entries(cityCounts)
          .map(([city, scans]) => ({ city, scans }))
          .sort((a, b) => b.scans - a.scans);

        const sortedCountries = Object.entries(countryCounts)
          .map(([country, scans]) => ({ country, scans }))
          .sort((a, b) => b.scans - a.scans);

        // Update state variables
        setMostScanningCitiesData(sortedCities);
        setMostScanningCountriesData(sortedCountries);

        // Fetch best reviews for each product
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('product_reviews')
          .select(`
            *,
            qr_codes!inner(product:products!inner(name))
          `)
          .order('rating', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          return;
        }

        // Group reviews by product and get the best review for each
        const reviewsByProduct = reviewsData.reduce((acc: { [key: string]: any[] }, review) => {
          const productName = review.qr_codes?.product?.name || 'Unknown Product';
          if (!acc[productName]) {
            acc[productName] = [];
          }
          acc[productName].push(review);
          return acc;
        }, {});

        // Get the best review for each product
        const bestReviewsData = Object.entries(reviewsByProduct).map(([product, reviews]) => {
          const bestReview = reviews[0]; // Already sorted by rating
          return {
            product,
            review: bestReview.comment || 'No comment provided',
            rating: bestReview.rating
          };
        });

        setBestReviews(bestReviewsData);

      } catch (err) {
        console.error('Unexpected error fetching or processing scan data:', err);
        // Optionally set error state for the user
      }
    };

    fetchAndProcessScanData();
  }, [user]); // Re-run effect if user changes

  const handleSaveLayout = () => {
    toast.success('Layout saved successfully!');
  };

  const handleResetLayout = () => {
    toast.success('Layout reset to default');
  };

  const renderCardContent = (id: string) => {
    switch (id) {
      case 'products':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Scans</th>
                </tr>
              </thead>
              <tbody>
                {mostScannedProducts.map((p) => (
                  <tr key={p.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{p.name}</td>
                    <td className="py-2 px-4 text-sm text-right text-blue-600 font-medium">{p.scans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'cities':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">City</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Scans</th>
                </tr>
              </thead>
              <tbody>
                {mostScanningCitiesData.map((c) => (
                  <tr key={c.city} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{c.city}</td>
                    <td className="py-2 px-4 text-sm text-right text-blue-600 font-medium">{c.scans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'countries':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Country</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Scans</th>
                </tr>
              </thead>
              <tbody>
                {mostScanningCountriesData.map((c) => (
                  <tr key={c.country} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{c.country}</td>
                    <td className="py-2 px-4 text-sm text-right text-blue-600 font-medium">{c.scans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'peakHours':
        return (
          <div className="flex items-center justify-center h-[300px] w-full">
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
              <Line data={peakHoursChartData} options={chartOptions} />
            </div>
          </div>
        );
      case 'latestScans':
        return (
          <div className="space-y-3">
            {latestScansData.length > 0 ? (latestScansData.map((scan, index) => (
              <div key={index} className={`p-3 rounded-lg ${scan.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{scan.product}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${scan.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {scan.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>{scan.city}, {scan.country}</div>
                  <div>{scan.time}</div>
                  <div className="text-gray-500">QR: {scan.qrCode}</div>
                </div>
              </div>
            ))) : (
              <div className="text-center text-gray-500">No recent scans found for this user.</div>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Review</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Rating</th>
                </tr>
              </thead>
              <tbody>
                {bestReviews.length > 0 ? (
                  bestReviews.map((r) => (
                    <tr key={r.product} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm">{r.product}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">"{r.review}"</td>
                      <td className="py-2 px-4 text-sm text-right text-blue-600">{r.rating}★</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">No reviews available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'qrCodes':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">QR Code</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Failed Scans</th>
                  <th className="text-center py-2 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mostScannedQRCodes.map((q) => (
                  <tr key={q.code} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{q.code}</td>
                    <td className="py-2 px-4 text-sm text-right text-red-600 font-medium">{q.unsuccessful}</td>
                    <td className="py-2 px-4 text-sm text-center">
                      {q.warning && (
                        <div className="inline-flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Warning</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  const cards = [
    { id: 'products', title: 'Most Scanned Products', icon: Star, color: 'bg-blue-600' },
    { id: 'cities', title: 'Most Scanning Cities', icon: MapPin, color: 'bg-blue-600' },
    { id: 'countries', title: 'Most Scanning Countries', icon: Globe, color: 'bg-blue-600' },
    { id: 'peakHours', title: 'Peak Hours of Scan', icon: Clock, color: 'bg-blue-600' },
    { id: 'latestScans', title: 'Latest Scans', icon: CheckCircle2, color: 'bg-blue-600' },
    { id: 'reviews', title: 'Best Reviews per Product', icon: MessageSquare, color: 'bg-blue-600' },
    { id: 'qrCodes', title: 'Suspicious QR Codes', icon: QrCode, color: 'bg-blue-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Analytics Dashboard
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleResetLayout}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Layout
          </Button>
          <Button
            onClick={handleSaveLayout}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((item) => (
          <Card key={item.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className={`${item.color} text-white rounded-t-lg`}>
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {renderCardContent(item.id)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 