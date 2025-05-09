
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const TermsOfServicePage = () => {
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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none">
            <p>Last Updated: May 9, 2025</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using seQRity's services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services.</p>
            
            <h2>2. Description of Services</h2>
            <p>seQRity provides a QR code authentication system that allows businesses to generate, manage, and track QR codes for product verification. Our services include QR code generation, customer feedback collection, analytics, and related functionalities.</p>
            
            <h2>3. User Accounts</h2>
            <p>To access certain features of our services, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate and current.</p>
            
            <h2>4. Subscription and Payments</h2>
            <p>Some of our services require payment of fees. You agree to pay all fees specified at the time of purchase. Subscription fees are billed in advance on a monthly or annual basis. Unless otherwise stated, subscriptions automatically renew for additional periods equal to the expiring subscription term.</p>
            
            <h2>5. Refunds</h2>
            <p>All sales are final for digital services. However, refunds may be considered on a case-by-case basis at our sole discretion for technical issues that prevent the use of our services. Please refer to our Refund Policy for more information.</p>
            
            <h2>6. User Content</h2>
            <p>You retain all rights to any content you submit, post, or display on or through our services. By submitting content to our services, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content for the purpose of providing and promoting our services.</p>
            
            <h2>7. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services to violate applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Attempt to gain unauthorized access to our services</li>
              <li>Use our services for fraudulent purposes</li>
              <li>Generate QR codes for counterfeit products</li>
            </ul>
            
            <h2>8. Intellectual Property</h2>
            <p>Our services and all content and software associated with our services are protected by copyright, trademark, and other intellectual property laws. You agree not to modify, adapt, translate, prepare derivative works from, decompile, reverse engineer, disassemble, or otherwise attempt to derive source code from our services.</p>
            
            <h2>9. Termination</h2>
            <p>We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service. Upon termination, your right to use our services will immediately cease.</p>
            
            <h2>10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, in no event shall seQRity be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
            
            <h2>11. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date.</p>
            
            <h2>12. Governing Law</h2>
            <p>These Terms of Service shall be governed by the laws of Algeria, without regard to its conflict of law provisions.</p>
            
            <h2>13. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at legal@seqrity.dz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
