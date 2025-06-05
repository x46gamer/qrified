import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface FeedbackFormProps {
  qrId: string;
  successBackground?: string;
  successText?: string;
  onClose?: () => void;
  isRtl: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  qrId, 
  successBackground = "#f0fdf4", 
  successText = "#16a34a",
  onClose,
  isRtl
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting feedback:', { qrId, feedback });
      
      const feedbackData = {
        qr_code_id: qrId,
        feedback: feedback.trim()
      };

      const { data, error } = await supabase
        .from('customer_feedback')
        .insert(feedbackData)
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback');
        return;
      }

      console.log('Feedback submitted successfully:', data);
      toast.success('Thank you for your feedback!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred while submitting feedback');
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
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="font-medium mb-1">{isRtl ? 'تم إرسال الملاحظات!' : 'Feedback Submitted!'}</h3>
          <p className="text-sm">{isRtl ? 'شكراً لمساعدتنا في التحسين.' : 'Thank you for helping us improve.'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{isRtl ? 'أعطِ ملاحظات' : 'Give Feedback'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback">{isRtl ? 'ملاحظاتك' : 'Your Feedback'}</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={isRtl ? 'يرجى مشاركة أفكارك أو اقتراحاتك أو الإبلاغ عن أي مشاكل...' : 'Please share your thoughts, suggestions, or report any issues...'}
              rows={4}
              className="mt-1"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !feedback.trim()}
            className="w-full"
          >
            {isSubmitting ? (isRtl ? 'جارٍ الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال الملاحظات' : 'Submit Feedback')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
