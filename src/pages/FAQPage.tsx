
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">How does the QR code authentication work?</AccordionTrigger>
              <AccordionContent>
                Our system generates unique, encrypted QR codes that you attach to your products. When customers scan these codes, our system verifies if the code is legitimate and hasn't been scanned before. This confirms the product's authenticity and allows customers to leave feedback.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">Can fake products simply copy my QR codes?</AccordionTrigger>
              <AccordionContent>
                No. Each QR code contains a unique encrypted identifier that becomes invalid after the first scan. Counterfeiters can copy the visual QR code, but when scanned, the system will show it's already been used or is invalid, alerting customers to a potential fake.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium">How do I print the QR codes?</AccordionTrigger>
              <AccordionContent>
                You can easily print QR codes directly from our platform on any standard printer. We support various formats including sheets of stickers, labels, or individual codes. You can also export them as PDF or PNG files to send to a professional printing service.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium">Can I customize what customers see when they scan?</AccordionTrigger>
              <AccordionContent>
                Yes! You can customize the verification page with your brand colors, logo, and custom messages for both successful verifications and counterfeit alerts. Pro and Lifetime plans also allow you to collect customer feedback after verification.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium">Does seQRity work offline?</AccordionTrigger>
              <AccordionContent>
                The QR codes themselves can be printed and attached to products offline, but the verification process requires an internet connection to check our secure database. This is essential for maintaining the security and validity of the authentication system.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-medium">How do I pay for the service?</AccordionTrigger>
              <AccordionContent>
                We offer multiple payment methods including credit cards, CCP, and BaridiMob. For the Lifetime deal, we also accept bank transfers. Contact our support team for more information on payment options available in your region.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left font-medium">Is there a free trial?</AccordionTrigger>
              <AccordionContent>
                Yes! You can sign up and generate up to 10 QR codes for free to test the system. This gives you access to the basic features so you can see how the system works before committing to a paid plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-center text-gray-700">
              Don't see your question here? <Link to="/login" className="text-blue-600 font-medium hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
