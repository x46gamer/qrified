
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be implemented here
    alert('Form submitted! In a real app, this would send your message to our team.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto py-16 px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent text-center">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Type your message here..." rows={5} required />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">Send Message</Button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Address</h3>
                    <p className="text-gray-600">support@seqrity.dz</p>
                    <p className="text-gray-600">contact@seqrity.dz</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Number</h3>
                    <p className="text-gray-600">+213 541 234 567</p>
                    <p className="text-gray-600">+213 669 876 543</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Our Office</h3>
                    <p className="text-gray-600">
                      123 Digital Avenue<br />
                      Tech Hub, Algiers 16000<br />
                      Algeria
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Business Hours</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Sunday - Thursday:</p>
                    <p>9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Friday & Saturday:</p>
                    <p>Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
