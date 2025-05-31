
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { QRCode } from '@/types/qrCode';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QRCodeAnalyticsProps {
  qrCodes: QRCode[];
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  image_urls: string[] | null;
  created_at: string;
  qr_code_id: string;
}

interface FeedbackData {
  id: string;
  feedback: string;
  created_at: string;
  qr_code_id: string;
}

const QRCodeAnalytics: React.FC<QRCodeAnalyticsProps> = ({ qrCodes }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching analytics data...');

        // Fetch reviews with updated RLS policies
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('product_reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          console.log('Fetched reviews:', reviewsData);
          setReviews(reviewsData || []);
        }

        // Fetch feedback with updated RLS policies
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('customer_feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (feedbackError) {
          console.error('Error fetching feedback:', feedbackError);
        } else {
          console.log('Fetched feedback:', feedbackData);
          setFeedback(feedbackData || []);
        }
      } catch (error) {
        console.error('Error in fetchAnalyticsData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();

    // Set up real-time subscriptions for live updates
    const reviewsSubscription = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'product_reviews' 
      }, (payload) => {
        console.log('Review change received:', payload);
        fetchAnalyticsData(); // Refresh data on any change
      })
      .subscribe();

    const feedbackSubscription = supabase
      .channel('feedback-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'customer_feedback' 
      }, (payload) => {
        console.log('Feedback change received:', payload);
        fetchAnalyticsData(); // Refresh data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsSubscription);
      supabase.removeChannel(feedbackSubscription);
    };
  }, []);

  const totalQRCodes = qrCodes.length;
  const scannedQRCodes = qrCodes.filter(qr => qr.isScanned).length;
  const scanRate = totalQRCodes > 0 ? Math.round((scannedQRCodes / totalQRCodes) * 100) : 0;
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0';

  // Chart data
  const scanData = [
    { name: 'Scanned', value: scannedQRCodes, color: '#22c55e' },
    { name: 'Not Scanned', value: totalQRCodes - scannedQRCodes, color: '#e5e7eb' }
  ];

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
    count: reviews.filter(review => review.rating === rating).length
  }));

  const monthlyScans = qrCodes
    .filter(qr => qr.scannedAt)
    .reduce((acc, qr) => {
      const month = new Date(qr.scannedAt!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyScans).map(([month, count]) => ({
    month,
    scans: count
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQRCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scanned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{scannedQRCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scan Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{averageRating}★</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scanData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {scanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Scans Trend */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Scan Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {reviews.slice(0, 10).map((review) => (
                <div key={review.id} className="border-b pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-yellow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm mb-2">{review.comment}</p>
                  )}
                  {review.image_urls && review.image_urls.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback ({feedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {feedback.length === 0 ? (
            <p className="text-muted-foreground">No feedback yet</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {feedback.slice(0, 10).map((item) => (
                <div key={item.id} className="border-b pb-2">
                  <div className="text-sm text-muted-foreground mb-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <p className="text-sm">{item.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeAnalytics;
