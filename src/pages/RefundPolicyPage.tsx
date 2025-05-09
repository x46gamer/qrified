
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto py-16 px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Refund Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p>Last Updated: May 9, 2025</p>
            
            <h2>1. Subscription Services</h2>
            <p>For monthly subscription plans:</p>
            <ul>
              <li>We offer a 7-day refund period from the date of subscription if you are not satisfied with our services</li>
              <li>Refund requests must be submitted in writing to billing@seqrity.dz</li>
              <li>No refunds will be issued after the 7-day period</li>
              <li>You may cancel your subscription at any time, but no partial refunds will be provided for unused portions of the current billing cycle</li>
            </ul>
            
            <h2>2. Lifetime Deals</h2>
            <p>For one-time lifetime purchases:</p>
            <ul>
              <li>We offer a 14-day refund period from the date of purchase</li>
              <li>Refund requests must be submitted in writing to billing@seqrity.dz with a detailed explanation of why the service does not meet your needs</li>
              <li>No refunds will be issued after the 14-day period</li>
            </ul>
            
            <h2>3. Refund Conditions</h2>
            <p>Refunds may be granted under the following conditions:</p>
            <ul>
              <li>Technical issues that significantly impact the functionality of our services and cannot be resolved by our support team</li>
              <li>Incorrect billing or charging errors</li>
              <li>Services not delivered as described</li>
            </ul>
            
            <p>Refunds may be denied under the following conditions:</p>
            <ul>
              <li>Simple change of mind or no longer needing the service</li>
              <li>Misunderstanding of service features that were clearly described in the service documentation</li>
              <li>Issues caused by your own technical setup or improper use of the service</li>
              <li>Requests made after the applicable refund period</li>
            </ul>
            
            <h2>4. Refund Process</h2>
            <p>To request a refund:</p>
            <ol>
              <li>Email billing@seqrity.dz with the subject line "Refund Request"</li>
              <li>Include your account email address and the reason for your refund request</li>
              <li>Our team will review your request within 3-5 business days</li>
              <li>If approved, refunds will be processed using the original payment method</li>
              <li>Refund processing time may vary depending on your payment provider (typically 5-10 business days)</li>
            </ol>
            
            <h2>5. Special Circumstances</h2>
            <p>We understand that exceptional situations may arise. If you believe your case warrants special consideration outside of this policy, please contact our customer support team to discuss your specific circumstances.</p>
            
            <h2>6. Changes to This Policy</h2>
            <p>We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website. We will notify users of any material changes by updating the "Last Updated" date at the top of this policy.</p>
            
            <h2>7. Contact Us</h2>
            <p>If you have any questions about this Refund Policy, please contact us at billing@seqrity.dz or through our contact page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
