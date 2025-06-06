import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';

type Review = {
  id: string;
  qr_code_id: string;
  rating: number;
  comment: string | null;
  image_urls: string[] | null;
  created_at: string;
  qr_codes?: {
    sequential_number: string;
    product: {
      name: string;
    };
  };
};

type Feedback = {
  id: string;
  qr_code_id: string;
  feedback: string;
  created_at: string;
  qr_codes?: {
    sequential_number: string;
    product?: {
      name: string;
    };
  };
};

const AdminFeedback = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('reviews');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'review' | 'feedback'} | null>(null);
  const { user } = useAuth();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    
    if (!user) {
      console.error('User not authenticated.');
      setLoading(false);
      setReviews([]);
      setFeedback([]);
      toast.error('You must be logged in to view feedback.');
      return;
    }

    try {
      if (activeTab === 'reviews') {
        const { data, error } = await supabase
          .from('product_reviews')
          .select(`
            *,
            qr_codes!inner(sequential_number, product:products(name))
          `)
          .eq('qr_codes.user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('Fetched reviews data:', data);
        setReviews(data as Review[]);
      } else {
        const { data, error } = await supabase
          .from('customer_feedback')
          .select(`
            *,
            qr_codes:customer_feedback_qr_code_id_fkey(sequential_number, product:products(name))
          `)
          .eq('customer_feedback_qr_code_id_fkey.user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('Fetched feedback data:', data);
        const mappedFeedback: Feedback[] = data.map((item: any) => ({
          id: item.id,
          qr_code_id: item.qr_code_id,
          feedback: item.feedback,
          created_at: item.created_at,
          qr_codes: item.qr_codes ? {
            sequential_number: item.qr_codes.sequential_number,
            product: item.qr_codes.product ? { name: item.qr_codes.product.name } : undefined
          } : undefined,
        }));

        setFeedback(mappedFeedback as Feedback[]);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { type, id } = itemToDelete;
      const table = type === 'review' ? 'product_reviews' : 'customer_feedback';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`${type === 'review' ? 'Review' : 'Feedback'} deleted successfully`);
      
      // Update the state
      if (type === 'review') {
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        setFeedback(feedback.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (id: string, type: 'review' | 'feedback') => {
    setItemToDelete({ id, type });
    setIsDeleteDialogOpen(true);
  };

  const viewItem = (item: Review | Feedback, type: 'review' | 'feedback') => {
    if (type === 'review') {
      setSelectedReview(item as Review);
    } else {
      setSelectedFeedback(item as Feedback);
    }
    setIsViewDialogOpen(true);
  };

  const openImageViewer = (review: Review, index: number) => {
    setSelectedReview(review);
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const goToNextImage = () => {
    if (selectedReview?.image_urls) {
      setCurrentImageIndex(prevIndex => Math.min(selectedReview.image_urls.length - 1, prevIndex + 1));
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Feedback Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Improvement Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews</CardTitle>
              <CardDescription>
                Reviews submitted by customers after product verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rating</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Images</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.qr_codes?.product?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {review.qr_codes?.sequential_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {review.comment || 'No comment'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.image_urls && review.image_urls.length > 0 ? (
                              <Badge variant="outline">{review.image_urls.length} images</Badge>
                            ) : (
                              'None'
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(review.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewItem(review, 'review')}
                              >
                                <Edit2 className="h-4 w-4 mr-1" /> View
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(review.id, 'review')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Feedback</CardTitle>
              <CardDescription>
                Suggestions from customers on how to improve products or services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : feedback.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.qr_codes?.product?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {item.qr_codes?.sequential_number || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate">
                              {item.feedback}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(item.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewItem(item, 'feedback')}
                              >
                                <Edit2 className="h-4 w-4 mr-1" /> View
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(item.id, 'feedback')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No feedback found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen && !!selectedReview} onOpenChange={() => {
        setIsViewDialogOpen(false);
        setSelectedReview(null);
        setSelectedFeedback(null);
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Rating</h4>
                <div className="flex mt-1">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Product</h4>
                <p className="mt-1">{selectedReview.qr_codes?.product?.name || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-medium">QR Code</h4>
                <p className="mt-1">{selectedReview.qr_codes?.sequential_number || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Comment</h4>
                <Textarea 
                  readOnly 
                  value={selectedReview.comment || 'No comment provided'} 
                  className="mt-1 min-h-[100px]" 
                />
              </div>
              
              {selectedReview.image_urls && selectedReview.image_urls.length > 0 && (
                <div>
                  <h4 className="font-medium">Images</h4>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedReview.image_urls.map((url, index) => (
                      <button key={index} onClick={() => openImageViewer(selectedReview, index)} className="focus:outline-none">
                        <img 
                          src={url} 
                          alt={`Review image ${index + 1}`} 
                          className="h-32 w-full object-cover rounded-md border cursor-pointer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium">Submitted on</h4>
                <p className="mt-1">{formatDate(selectedReview.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Feedback Dialog */}
      <Dialog open={isViewDialogOpen && !!selectedFeedback} onOpenChange={() => {
        setIsViewDialogOpen(false);
        setSelectedReview(null);
        setSelectedFeedback(null);
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">QR Code</h4>
                <p className="mt-1">{selectedFeedback.qr_codes?.sequential_number || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Feedback</h4>
                <Textarea 
                  readOnly 
                  value={selectedFeedback.feedback} 
                  className="mt-1 min-h-[150px]" 
                />
              </div>
              
              <div>
                <h4 className="font-medium">Submitted on</h4>
                <p className="mt-1">{formatDate(selectedFeedback.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={isImageViewerOpen} onOpenChange={closeImageViewer}>
        <DialogContent 
          className="max-w-full w-auto h-auto flex items-center justify-center bg-transparent backdrop-filter backdrop-blur-lg p-0 border-none text-white"
        >
          {selectedReview && selectedReview.image_urls && selectedReview.image_urls.length > 0 && (
            <div className="relative flex items-center justify-center">
              <img
                src={selectedReview.image_urls[currentImageIndex]}
                alt={`Review image ${currentImageIndex + 1}`}
                className="max-h-screen max-w-screen object-contain"
              />
              {selectedReview.image_urls.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
                      onClick={goToPreviousImage}
                    >
                      <ChevronLeft className="h-10 w-10" />
                    </Button>
                  )}
                  {currentImageIndex < selectedReview.image_urls.length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
                      onClick={goToNextImage}
                    >
                      <ChevronRight className="h-10 w-10" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeedback;
