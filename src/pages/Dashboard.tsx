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
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const { user } = useAuth();
  const [bestReviews, setBestReviews] = useState<Array<{
    product: string;
    review: string;
    rating: number;
  }>>([]);

  // Add state variables for all-time statistics
  const [totalScans, setTotalScans] = useState<number>(0);
  const [verifiedScans, setVerifiedScans] = useState<number>(0);
  const [declinedScans, setDeclinedScans] = useState<number>(0);
  const [reviewedScans, setReviewedScans] = useState<number>(0);

  // State for date range filter
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

  // Add state variable for most scanned products
  const [mostScannedProducts, setMostScannedProducts] = useState<{ name: string; scans: number }[]>([]);

  // Fetch and process scan data for various dashboard sections
  useEffect(() => {
    const fetchAndProcessScanData = async () => {
      if (!user) return;

      try {
        let totalQuery = supabase
          .from('qr_codes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (startDate) {
          totalQuery = totalQuery.gte('created_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          totalQuery = totalQuery.lt('created_at', nextDay.toISOString());
        }

        // Fetch total count of all QR codes for the user
        const { count: totalCount, error: totalCountError } = await totalQuery;

        if (totalCountError) {
          console.error('Error fetching total QR code count:', totalCountError);
        } else {
          setTotalScans(totalCount || 0);
        }

        let verifiedQuery = supabase
          .from('qr_codes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_scanned', true);

        if (startDate) {
          verifiedQuery = verifiedQuery.gte('scanned_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          verifiedQuery = verifiedQuery.lt('scanned_at', nextDay.toISOString());
        }

        // Fetch count of verified scans (is_scanned = true)
        const { count: verifiedCount, error: verifiedCountError } = await verifiedQuery;

        if (verifiedCountError) {
          console.error('Error fetching verified scan count:', verifiedCountError);
        } else {
          setVerifiedScans(verifiedCount || 0);
        }

        // Fetch all QR codes for the user within the date range to sum failed attempts
        let declinedQuery = supabase
          .from('qr_codes')
          .select('id, failed_scan_attempts') // Select data to calculate total failed attempts
          .eq('user_id', user.id);

        // Apply date filter on created_at
        if (startDate) {
          declinedQuery = declinedQuery.gte('created_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          declinedQuery = declinedQuery.lt('created_at', nextDay.toISOString());
        }

        // Execute the query to get the data
        const { data: declinedData, error: declinedCountError } = await declinedQuery;

        if (declinedCountError) {
          console.error('Error fetching QR code data for failed attempts:', declinedCountError);
        } else {
          // Calculate total failed attempts from the fetched data
          const totalFailedAttempts = declinedData?.reduce((sum, qr) => sum + (qr.failed_scan_attempts || 0), 0) || 0;
          setDeclinedScans(totalFailedAttempts); // Set total failed attempts as the declined count
        }

        let reviewedQuery = supabase
          .from('product_reviews')
          .select('id', { count: 'exact', head: true });
          // Reviews are linked to qr_codes which are linked to users, no direct user_id on product_reviews
          // To filter by user and date, we might need a more complex query or rethink the schema/RLS
          // For now, filtering only by date on the review creation time

        if (startDate) {
          reviewedQuery = reviewedQuery.gte('created_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          reviewedQuery = reviewedQuery.lt('created_at', nextDay.toISOString());
        }

        // Fetch count of product reviews
        const { count: reviewedCount, error: reviewedCountError } = await reviewedQuery;

        if (reviewedCountError) {
          console.error('Error fetching reviewed scan count:', reviewedCountError);
        } else {
          setReviewedScans(reviewedCount || 0);
        }

        let scannedQRCodesQuery = supabase
          .from('qr_codes')
          .select('scanned_at, scanned_city, scanned_country, sequential_number, is_scanned, id, product_id, products(name), failed_scan_attempts')
          .eq('is_scanned', true) // Only get successfully scanned codes
          .eq('user_id', user.id); // Filter for current user's QR codes

        if (startDate) {
          scannedQRCodesQuery = scannedQRCodesQuery.gte('scanned_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          scannedQRCodesQuery = scannedQRCodesQuery.lt('scanned_at', nextDay.toISOString());
        }

        // Fetch all scanned QR codes for the user
        const { data: scannedQRCodes, error: fetchError } = await scannedQRCodesQuery;

        if (fetchError) {
          console.error('Error fetching scanned QR codes:', fetchError);
          // Optionally set error state for the user
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
          setMostScannedQRCodes([]);
          setMostScanningCitiesData([]);
          setMostScanningCountriesData([]);
          setMostScannedProducts([]);
          setBestReviews([]); // Also clear reviews if no scan data
          return;
        }

        if (!scannedQRCodes || scannedQRCodes.length === 0) {
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
             setMostScannedQRCodes([]);
             setMostScanningCitiesData([]);
             setMostScanningCountriesData([]);
             setMostScannedProducts([]);
             setBestReviews([]); // Also clear reviews if no scan data
             return;
           }

        // --- Process data for Latest Scans ---
        // Ensure scannedQRCodes is treated as an array of potential QR codes
        const validScans = scannedQRCodes ? (scannedQRCodes as Partial<QRCode>[]).filter(scan => scan && scan.id && scan.scanned_at) : []; // Filter out scans without scanned_at for date filtering

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
            qrCode: formattedSequentialNumber,
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
          .slice(0, 8) // Limit to 8 codes
          .map(qr => ({
            code: String(qr.sequential_number).padStart(6, '0'),
            unsuccessful: qr.failed_scan_attempts || 0,
            warning: (qr.failed_scan_attempts || 0) > 10,
          }));

        setMostScannedQRCodes(suspiciousQRCodes);

        // --- Process data for Cities and Countries ---
        const cityCounts: { [key: string]: number } = {};
        const countryCounts: { [key: string]: number } = {};

        validScans.forEach(scan => {
          if (scan.scanned_city) {
            cityCounts[scan.scanned_city] = (cityCounts[scan.scanned_city] || 0) + 1;
          }
          if (scan.scanned_country) {
            countryCounts[scan.scanned_country] = (countryCounts[scan.scanned_country] || 0) + 1;
          }
        });

        const sortedCities = Object.entries(cityCounts)
          .map(([city, scans]) => ({ city, scans }))
          .sort((a, b) => b.scans - a.scans);

        const sortedCountries = Object.entries(countryCounts)
          .map(([country, scans]) => ({ country, scans }))
          .sort((a, b) => b.scans - a.scans);

        setMostScanningCitiesData(sortedCities);
        setMostScanningCountriesData(sortedCountries);

        let reviewsQuery = supabase
          .from('product_reviews')
          .select(`
            *,
            qr_codes!inner(
              product_id,
              products!inner(
                name
              )
            )
          `)
          .order('rating', { ascending: false });

        // Filter reviews by date on created_at
        if (startDate) {
          reviewsQuery = reviewsQuery.gte('created_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          reviewsQuery = reviewsQuery.lt('created_at', nextDay.toISOString());
        }

        // Fetch best reviews for each product
        const { data: reviewsData, error: reviewsError } = await reviewsQuery;

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          // Handle the specific Supabase error if possible, or just return
          console.error('Supabase Error Details:', reviewsError.details, reviewsError.hint, reviewsError.message);
          setBestReviews([]); // Clear reviews on error
          // NOTE: The linter error 'Property 'products' does not exist on type 'SelectQueryError<...>' might still persist here
          // This indicates an issue with Supabase's type generation or the query itself when there are errors.
          return;
        }

        // Group reviews by product and get the best review for each
        const reviewsByProduct = reviewsData.reduce((acc: { [key: string]: any[] }, review) => {
          let productName = 'Default Product';
          // Safely access the product name using optional chaining and checks
          // Access 'products' here based on the query alias
          // Use a more robust check to satisfy linter
          const productData = review.qr_codes?.products;
          if (productData && typeof productData === 'object' && 'name' in productData && typeof productData.name === 'string') {
               productName = productData.name;
          }

          if (!acc[productName]) {
            acc[productName] = [];
          }
          acc[productName].push(review);
          return acc;
        }, {});

        // Get the best review for each product
        const bestReviewsData = Object.entries(reviewsByProduct).map(([productName, reviews]) => {
          const bestReview = reviews[0]; // Since we ordered by rating desc, the first review is the best
          return {
            product: productName,
            review: bestReview.comment || 'No comment provided',
            rating: bestReview.rating
          };
        });

        setBestReviews(bestReviewsData);

        let scannedProductsQuery = supabase
          .from('qr_codes')
          .select(`
            product_id,
            products(name),
            is_scanned
          `)
          .eq('is_scanned', true)
          .eq('user_id', user.id);

        // Filter scanned products by date on scanned_at
        if (startDate) {
          scannedProductsQuery = scannedProductsQuery.gte('scanned_at', startDate);
        }
        if (endDate) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          scannedProductsQuery = scannedProductsQuery.lt('scanned_at', nextDay.toISOString());
        }

        // Fetch most scanned products
        const { data: scannedProductsData, error: scannedProductsError } = await scannedProductsQuery;

        if (scannedProductsError) {
          console.error('Error fetching scanned products:', scannedProductsError);
        } else if (scannedProductsData) {
          const productScanCounts: { [key: string]: { name: string, scans: number } } = {};
          scannedProductsData.forEach((qr: any) => {
            const productId = qr.product_id;
            const productName = qr.products?.name || 'Unknown Product'; // Keep Unknown for this specific count if product name is null
            if (!productScanCounts[productId]) {
              productScanCounts[productId] = { name: productName, scans: 0 };
            }
            productScanCounts[productId].scans += 1;
          });
          const sortedProducts = Object.values(productScanCounts).sort((a, b) => b.scans - a.scans);
          setMostScannedProducts(sortedProducts);
        }

      } catch (err) {
        console.error('Unexpected error fetching or processing scan data:', err);
        // Optionally set error state for the user
      }
    };

    fetchAndProcessScanData();
  }, [user, startDate, endDate]); // Re-run effect if user or dates change

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
                {mostScannedQRCodes.slice(0, 8).map((q) => (
                  <tr key={q.code} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{q.code}</td>
                    <td className="py-2 px-4 text-sm text-right text-red-600 font-medium">{q.unsuccessful}</td>
                    <td className="py-2 px-4 text-sm text-center">
                      {q.warning && (
                        <>
                          <div 
                            className="inline-flex items-center gap-1 text-red-600 cursor-pointer hover:text-red-700"
                            onClick={() => setShowWarningPopup(true)}
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Warning</span>
                          </div>
                          {showWarningPopup && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
                              <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
                                <button 
                                  onClick={() => setShowWarningPopup(false)}
                                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3 mb-4">
                                  <AlertTriangle className="w-6 h-6 text-red-500" />
                                  <h3 className="text-lg font-semibold text-gray-900">Suspicious Activity Detected</h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                  This QR code was scanned multiple times and it's very suspicious to being copied. But QRified got you covered.
                                </p>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setShowWarningPopup(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    Got it
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
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
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input 
              type="date" 
              id="startDate"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input 
              type="date" 
              id="endDate"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
        </div>
      </div>

      {/* All Time Stats Band */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">{totalScans}</div>
          <div className="text-sm text-gray-600">All Scans</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">{verifiedScans}</div>
          <div className="text-sm text-gray-600">All Verified</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">{declinedScans}</div>
          <div className="text-sm text-gray-600">All Declined</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600">{reviewedScans}</div>
          <div className="text-sm text-gray-600">All Reviewed Scans</div>
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