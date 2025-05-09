
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const AboutPage = () => {
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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">About seQRity</h1>
          
          <div className="prose prose-blue max-w-none">
            <p>seQRity was founded in 2023 with a simple mission: to help Algerian merchants protect their products from counterfeiting through accessible technology.</p>
            
            <h2>Our Story</h2>
            <p>After witnessing local businesses struggle with fake versions of their products flooding the market, our founders decided to create an affordable authentication system specifically designed for the Algerian market.</p>
            
            <p>What began as a simple QR code generator has evolved into a comprehensive product protection platform with features like customer feedback collection, analytics, and team management.</p>
            
            <h2>Our Mission</h2>
            <p>We believe that product authenticity shouldn't be a luxury feature for large corporations. Our mission is to democratize anti-counterfeiting technology for businesses of all sizes.</p>
            
            <h2>Made in Algeria</h2>
            <p>We're proud to be an Algerian company building technology solutions for local and regional businesses. Our platform is designed with the specific needs of the Algerian and MENA markets in mind, including Arabic language support and local payment methods.</p>
            
            <h2>Join Us</h2>
            <p>Whether you're a small artisan business or a growing brand, we invite you to join the thousands of merchants already using seQRity to protect their products and build customer trust.</p>
            
            <div className="mt-8 text-center">
              <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500">
                <Link to="/signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
