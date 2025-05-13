
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p>Last Updated: May 9, 2025</p>
            
            <h2>Introduction</h2>
            <p>QRified ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our QR code authentication service.</p>
            
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (name, email address, password, business details)</li>
              <li>Payment information (processed through secure third-party payment processors)</li>
              <li>Product information related to QR code generation</li>
              <li>Customer feedback and reviews submitted through our platform</li>
              <li>Communications with our support team</li>
            </ul>
            
            <p>We also automatically collect certain information when you use our service:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>QR code scan data (time, location if permitted, device type)</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Verify product authenticity through QR code scans</li>
              <li>Generate analytics and reports for merchants</li>
              <li>Respond to comments, questions, and customer service requests</li>
              <li>Send product updates, security alerts, and administrative messages</li>
              <li>Monitor and analyze trends and usage of our services</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
            </ul>
            
            <h2>Data Retention</h2>
            <p>We store your information for as long as your account is active or as needed to provide you with our services. We may retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            
            <h2>Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the information we collect and store. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.</p>
            
            <h2>Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            
            <p>To exercise these rights, please contact us at privacy@qrified.dz.</p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>QRified<br/>123 Digital Avenue<br/>Tech Hub, Algiers 16000<br/>Algeria<br/>privacy@qrified.dz</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
