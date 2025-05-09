
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface FeedbackFormProps {
  qrId: string;
  successBackground: string;
  successText: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ qrId, successBackground, successText }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('customer_feedback')
        .insert({
          qr_code_id: qrId,
          feedback: feedback.trim()
        });
        
      if (error) throw error;
      
      toast.success("Thank you for your feedback!");
      setFeedback('');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full mt-4">
      <CardHeader style={{ backgroundColor: `${successBackground}30` }}>
        <CardTitle style={{ color: successText }}>Help Us Improve</CardTitle>
        <CardDescription style={{ color: successText }}>
          Share your suggestions for how we can improve our products or service
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What could we improve? We value your input!"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !feedback.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
