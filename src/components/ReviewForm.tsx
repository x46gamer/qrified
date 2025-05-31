
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ReviewFormProps {
  qrId: string;
  successBackground?: string;
  successText?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  qrId, 
  successBackground = "#f0fdf4", 
  successText = "#16a34a" 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting review:', { qrId, rating, comment });
      
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          qr_code_id: qrId,
          rating: rating,
          comment: comment.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting review:', error);
        toast.error('Failed to submit review');
        return;
      }

      console.log('Review submitted successfully:', data);
      toast.success('Thank you for your review!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card 
        className="w-full" 
        style={{ 
          backgroundColor: successBackground, 
          color: successText 
        }}
      >
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <h3 className="font-medium mb-1">Review Submitted!</h3>
          <p className="text-sm">Thank you for your feedback.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Rate This Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
