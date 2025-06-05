import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ReviewFormProps {
  qrId: string;
  successBackground?: string;
  successText?: string;
  onClose?: () => void;
  isRtl: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  qrId, 
  successBackground = "#f0fdf4", 
  successText = "#16a34a",
  onClose,
  isRtl
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml', 'image/tiff', 'image/x-icon']; // Common image MIME types
    const validImages = files.filter(file => allowedTypes.includes(file.type));
    
    if (validImages.length !== files.length) {
      toast.error('Please select only valid image files (JPG, PNG, GIF, BMP, WEBP, SVG, TIFF, ICO)');
      return;
    }
    
    if (images.length + validImages.length > 2) {
      toast.error('Maximum 2 images allowed');
      return;
    }
    
    setImages(prev => [...prev, ...validImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      
      // Use the correct bucket name 'reviews'
      const bucketName = 'reviews';

      // First, ensure the bucket exists (optional, but good practice)
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Attempt to create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          // Depending on your requirements, you might want to stop here
          // For now, we'll let the upload attempt proceed, which will likely fail
        }
      }
      
      // Upload to the specified bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL from the specified bucket
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting review:', { qrId, rating, comment, imageCount: images.length });
      
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (images.length > 0) {
        try {
          imageUrls = await uploadImages(images);
          console.log('Images uploaded successfully:', imageUrls);

          // Check if images were selected but none uploaded successfully
          if (images.length > 0 && imageUrls.length === 0) {
             console.error('Image upload failed, no URLs returned.');
             toast.error('Failed to upload images. Please try again.');
             setIsSubmitting(false); 
             return; 
          }

        } catch (uploadError: any) {
          console.error('Error uploading images:', uploadError);
          toast.error(`Failed to upload images: ${uploadError.message || 'Unknown error'}. Review not submitted.`);
          setIsSubmitting(false); 
          return; 
        }
      }
      
      const reviewData = {
        qr_code_id: qrId,
        rating: rating,
        comment: comment.trim() || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null
      };

      const { data, error } = await supabase
        .from('product_reviews')
        .insert(reviewData)
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
      // This finally block will not be reached if we return early in catch/if blocks above
      // setIsSubmitting(false); 
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
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <h3 className="font-medium mb-1">{isRtl ? 'تم إرسال التقييم!' : 'Review Submitted!'}</h3>
          <p className="text-sm">{isRtl ? 'شكراً لك على ملاحظاتك.' : 'Thank you for your feedback.'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{isRtl ? 'قيم هذا المنتج' : 'Rate This Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{isRtl ? 'التقييم' : 'Rating'}</Label>
            <div className="flex gap-1 mt-1 justify-center">
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
            <Label htmlFor="comment">{isRtl ? 'تعليق (اختياري)' : 'Comment (Optional)'}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isRtl ? 'أخبرنا عن تجربتك مع هذا المنتج...' : 'Tell us about your experience with this product...'}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="images">{isRtl ? 'الصور (اختياري - 2 كحد أقصى)' : 'Images (Optional - Max 2)'}</Label>
            <div className="mt-1">
              <Input
                id="images"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff,.ico"
                multiple
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (isRtl ? 'جارٍ الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال التقييم' : 'Submit Review')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
