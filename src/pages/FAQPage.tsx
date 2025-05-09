
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto py-16 px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  What is seQRity and how does it work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  seQRity is an anti-counterfeiting solution that uses unique, encrypted QR codes to authenticate products. Each code can only be verified once, providing proof of authenticity. When a customer scans the code, they'll immediately know if the product is genuine or fake, and can leave feedback for the merchant.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  How secure are the QR codes?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Our QR codes use AES-256 encryption, the same standard used by banks and government agencies. Each code is unique, one-time use, and linked to your specific products. They cannot be copied or replicated by counterfeiters.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Can I customize the verification page customers see?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, with Pro and Lifetime plans, you can fully customize the verification pages with your logo, colors, and custom messages in both Arabic and French. You can also collect customer feedback and reviews during the verification process.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How many team members can use my account?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Our Pro plan includes up to 3 team members. Each team member can have specific permissions (admin or employee). Employees can only generate QR codes, while admins have full access to all features including analytics and settings.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  Do you offer technical support?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, all plans include email support. Pro and Lifetime plans include priority support via WhatsApp and email with a maximum 24-hour response time.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  What happens if I exceed my monthly QR code limit?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  If you exceed your monthly limit, you can purchase additional QR codes at a rate of 500 DZD per 100 codes. Alternatively, you can upgrade to a higher plan or the Lifetime deal for unlimited codes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-medium">
                  Is there a free trial available?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we offer a 7-day free trial with access to all Pro features and up to 25 QR codes. No credit card required to start your trial.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left font-medium">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept BaridiMob, CCP transfers, and in-person cash payments in major Algerian cities. For international clients, we also accept PayPal and bank transfers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
