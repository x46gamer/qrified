
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ReviewFormProps {
  qrId: string;
  successBackground: string;
  successText: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ qrId, successBackground, successText }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Convert FileList to array
    const fileArray = Array.from(e.target.files);
    
    // Only allow up to 3 images total
    const allowedFiles = fileArray.slice(0, 3 - images.length);
    
    if (allowedFiles.length + images.length > 3) {
      toast.warning("You can upload a maximum of 3 images");
    }
    
    // Add files and create previews
    setImages(prev => [...prev, ...allowedFiles]);
    
    // Generate previews
    allowedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input value so selecting the same file again works
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    
    const imageUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${qrId}-review-${Date.now()}-${i}.${fileExt}`;
      const filePath = `reviews/${fileName}`;
      
      try {
        const { error } = await supabase
          .storage
          .from('app-assets')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading image:', error);
          continue; // Skip this file on error
        }
        
        const { data } = supabase
          .storage
          .from('app-assets')
          .getPublicUrl(filePath);
          
        imageUrls.push(data.publicUrl);
      } catch (error) {
        console.error('Error in upload process:', error);
      }
    }
    
    return imageUrls;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload images if any
      const imageUrls = await uploadImages();
      
      // Submit review to database
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          qr_code_id: qrId,
          rating,
          comment: comment.trim() || null,
          image_urls: imageUrls.length > 0 ? imageUrls : null
        });
        
      if (error) throw error;
      
      toast.success("Thank you for your review!");
      
      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      setPreviews([]);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader style={{ backgroundColor: `${successBackground}30` }}>
        <CardTitle style={{ color: successText }}>Leave a Review</CardTitle>
        <CardDescription style={{ color: successText }}>
          Share your experience with this product
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Comments (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="min-h-[100px]"
            />
          </div>
          
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">Add Photos (Optional)</Label>
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {previews.length < 3 && (
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="h-20 w-20 flex items-center justify-center border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-6 w-6 text-gray-400" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload up to 3 images (max 2MB each)
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
