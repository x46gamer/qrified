
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle, BookOpen, MessageSquare, Video, FileText } from 'lucide-react';

const SupportPage = () => {
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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent text-center">Support Center</h1>
          
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-3xl">
              <input 
                type="text" 
                placeholder="Search documentation, FAQs, and tutorials..." 
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link to="/login" className="bg-white rounded-xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
                  <p className="text-gray-600 mb-4">Find answers to common questions about our services, pricing, and technical details.</p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">View FAQs</Button>
                </div>
              </div>
            </Link>
            
            <Link to="/login" className="bg-white rounded-xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600 shrink-0">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Documentation</h2>
                  <p className="text-gray-600 mb-4">Detailed guides for using every feature of our platform and technical documentation.</p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">Read Docs</Button>
                </div>
              </div>
            </Link>
          </div>
          
          <h2 className="text-2xl font-semibold text-center mb-6">Quick Help Guides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/login" className="bg-white rounded-xl shadow-md p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold mb-2">Getting Started Guide</h3>
              <p className="text-gray-600 text-sm">Learn how to set up your account and generate your first QR codes.</p>
            </Link>
            
            <Link to="/login" className="bg-white rounded-xl shadow-md p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold mb-2">QR Code Templates</h3>
              <p className="text-gray-600 text-sm">Explore all available templates and learn how to customize them.</p>
            </Link>
            
            <Link to="/login" className="bg-white rounded-xl shadow-md p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 text-sm">Learn how to interpret scan data and customer feedback reports.</p>
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Need Personal Assistance?</h2>
                <p className="mb-4">Our support team is ready to help you with any questions or issues.</p>
                <div className="flex gap-4 flex-wrap">
                  <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Link to="/login" className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>Live Chat</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link to="/login" className="flex items-center gap-2">
                      <Video size={16} />
                      <span>Schedule Demo</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block w-24 h-24 bg-white/15 rounded-full flex-shrink-0 backdrop-blur-sm">
                <div className="w-full h-full flex items-center justify-center">
                  <HelpCircle size={48} className="text-white/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
