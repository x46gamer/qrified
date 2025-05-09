
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { calculateScanRate } from '@/utils/qrCodeUtils';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';

interface QRCodeAnalyticsProps {
  qrCodes: QRCode[];
}

interface ScanMetrics {
  totalQRCodes: number;
  scannedQRCodes: number;
  scanRate: number;
  enabledQRCodes: number;
  disabledQRCodes: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface Review {
  id: string;
  qr_code_id: string;
  rating: number;
  comment: string;
  image_urls: string[] | null;
  created_at: string;
}

interface Feedback {
  id: string;
  qr_code_id: string;
  feedback: string;
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const QRCodeAnalytics: React.FC<QRCodeAnalyticsProps> = ({ qrCodes }) => {
  const [metrics, setMetrics] = useState<ScanMetrics>({
    totalQRCodes: 0,
    scannedQRCodes: 0,
    scanRate: 0,
    enabledQRCodes: 0,
    disabledQRCodes: 0
  });
  
  const [scanHistory, setScanHistory] = useState<{ date: string; count: number }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    calculateMetrics();
    fetchScanHistory();
    fetchReviewsAndFeedback();
  }, [qrCodes]);
  
  const calculateMetrics = () => {
    if (!qrCodes.length) return;
    
    const scannedCount = qrCodes.filter(qr => qr.isScanned).length;
    const enabledCount = qrCodes.filter(qr => qr.isEnabled).length;
    
    setMetrics({
      totalQRCodes: qrCodes.length,
      scannedQRCodes: scannedCount,
      scanRate: calculateScanRate(qrCodes.length, scannedCount),
      enabledQRCodes: enabledCount,
      disabledQRCodes: qrCodes.length - enabledCount
    });
  };
  
  const fetchScanHistory = async () => {
    setIsLoading(true);
    try {
      // Group scanned QR codes by date
      const scannedQRs = qrCodes.filter(qr => qr.isScanned && qr.scannedAt);
      
      const dateGroups: Record<string, number> = {};
      scannedQRs.forEach(qr => {
        if (!qr.scannedAt) return;
        const date = new Date(qr.scannedAt).toLocaleDateString();
        dateGroups[date] = (dateGroups[date] || 0) + 1;
      });
      
      // Convert to chart data format
      const history = Object.entries(dateGroups).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setScanHistory(history);
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviewsAndFeedback = async () => {
    try {
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      } else if (reviewsData) {
        setReviews(reviewsData);
      }

      // Fetch feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('customer_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      } else if (feedbackData) {
        setFeedback(feedbackData);
      }
    } catch (error) {
      console.error('Error fetching reviews and feedback:', error);
    }
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  const statusData: ChartData[] = [
    { name: 'Scanned', value: metrics.scannedQRCodes },
    { name: 'Not Scanned', value: metrics.totalQRCodes - metrics.scannedQRCodes }
  ];
  
  const enablementData: ChartData[] = [
    { name: 'Enabled', value: metrics.enabledQRCodes },
    { name: 'Disabled', value: metrics.disabledQRCodes }
  ];

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: reviews.filter(review => review.rating === rating).length
  }));

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalQRCodes}</div>
                <p className="text-xs text-muted-foreground">
                  Generated QR codes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scan Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.scanRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.scannedQRCodes} of {metrics.totalQRCodes} scanned
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.enabledQRCodes}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {Math.round((metrics.enabledQRCodes / metrics.totalQRCodes) * 100) || 0}% Enabled
                  </Badge>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {Math.round((metrics.disabledQRCodes / metrics.totalQRCodes) * 100) || 0}% Disabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>QR Code Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>QR Code Enablement Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enablementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {enablementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {scanHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scanHistory}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 70
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Scans" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No scan data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qrCodes
                  .filter(qr => qr.isScanned && qr.scannedAt)
                  .sort((a, b) => new Date(b.scannedAt || 0).getTime() - new Date(a.scannedAt || 0).getTime())
                  .slice(0, 5)
                  .map(qr => (
                    <div key={qr.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">QR #{qr.sequentialNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(qr.scannedAt || 0).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={qr.isEnabled ? "default" : "destructive"}>
                        {qr.isEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                {qrCodes.filter(qr => qr.isScanned && qr.scannedAt).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">
                  Customer product reviews
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageRating()}</div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">
                      {star <= Math.round(Number(calculateAverageRating())) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Review Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.scannedQRCodes > 0 
                    ? `${Math.round((reviews.length / metrics.scannedQRCodes) * 100)}%` 
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Of scanned products
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {ratingDistribution.some(item => item.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratingDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Reviews" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No review data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-yellow-400">
                              {star <= review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                      )}
                      
                      {review.image_urls && review.image_urls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {review.image_urls.map((image, i) => (
                            <img 
                              key={i}
                              src={image} 
                              alt={`Review ${i+1}`}
                              className="w-16 h-16 object-cover rounded-md" 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No reviews available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedback.length}</div>
                <p className="text-xs text-muted-foreground">
                  Customer improvement suggestions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Feedback Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.scannedQRCodes > 0 
                    ? `${Math.round((feedback.length / metrics.scannedQRCodes) * 100)}%` 
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Of scanned products
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.length > 0 ? (
                  feedback.map(item => (
                    <div key={item.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Improvement Suggestion</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.feedback}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No feedback available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCodeAnalytics;
