
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, 
  Star, 
  ShoppingCart, 
  Users, 
  Shield, 
  ShieldCheck, 
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Lock,
  ChevronUp
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Show scroll to top when user scrolls down more than 500px
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add animation classes on mount with delay for staggered effect
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, i * 150);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header - Now with auto-hide on scroll */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm -translate-y-full' : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">seQRity</span>
            </h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-blue-500/25">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChevronUp size={24} />
      </button>

      {/* Hero Section - Enhanced with gradients and animations */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 opacity-70 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-on-scroll opacity-0 relative">
            <span className="bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent relative">
              Your Products Deserve Authenticity.
              <div className="absolute -top-4 -left-4 w-14 h-14 border-t-2 border-l-2 border-blue-400 opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 border-b-2 border-r-2 border-violet-400 opacity-60"></div>
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-on-scroll opacity-0">
            Stop Fakes, Build Trust, and Collect Real Feedback — Instantly.
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-on-scroll opacity-0">
            Launch your smart QR code authentication system in minutes. Designed for Algerian merchants. 
            Powered by modern encryption, analytics, and customer feedback tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-on-scroll opacity-0">
            <Button size="lg" asChild className="px-8 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-blue-500/25 transition-all">
              <Link to="/product-check">Try the Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 border-blue-500 text-blue-600 hover:bg-blue-50">
              <Link to="/login">Watch How It Works</Link>
            </Button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl shadow-blue-200/50 max-w-2xl mx-auto animate-on-scroll opacity-0 transform transition-all hover:shadow-2xl hover:shadow-blue-200/70 hover:-translate-y-1">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="text-3xl">➡️</div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg flex items-center justify-center shadow-inner">
                  <CheckCircle size={32} />
                </div>
                <div className="text-3xl">➡️</div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-lg flex items-center justify-center shadow-inner">
                  <Star size={32} className="animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 mt-4 font-medium">Customer scans QR code → Verification → Leaves review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZjBmNGZhIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTM2IDE4YzIuMjA5IDAgNCAxLjc5MSA0IDRzLTEuNzkxIDQtNCA0LTQtMS43OTEtNC00IDEuNzkxLTQgNC00eiIgZmlsbD0iI2UwZTdmZiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            Built for Smart Sellers Who Want to Stay Ahead
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShoppingCart size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">E-commerce Merchants</h3>
              <p className="text-gray-600">Add authenticity & boost conversions</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-300 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Shield size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Local Brands</h3>
              <p className="text-gray-600">Protect reputation from cheap copies</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-300 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Wholesale Distributors</h3>
              <p className="text-gray-600">Manage large batches with ease</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-300 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Dropshippers</h3>
              <p className="text-gray-600">Give your product a professional edge</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            3 Simple Steps to Secure Your Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-blue-200"></div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Generate Encrypted QR Codes</h3>
              <p className="text-gray-600">Customize template, quantity, and branding</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Print & Attach</h3>
              <p className="text-gray-600">Your team can print in bulk — no tech skills needed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Scan & Verify</h3>
              <p className="text-gray-600">Customers scan to verify product and leave reviews</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6 mt-10 text-center animate-on-scroll opacity-0">
            <p className="text-blue-800 font-medium">
              "Each QR code is one-time use, AES-encrypted, and tracked with full analytics."
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-violet-50 px-4 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxIDAgMS43OTIuNjQgMi4xLjk0bDIuMjcgMi4yOGMuMy4zMS45NCAxLjA1Ljk0IDIuMDYgMCAyLjIxLTEuNzkgNC00IDQtMi4yMDkgMC00LTEuNzktNC00czEuNzkxLTQgNC00eiIgc3Ryb2tlPSIjZWRlZGZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBmaWxsPSIjZjVmNWZmIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
            All-in-One Platform. Packed with Smart Features.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">QR Code Generator</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Create 1–100 codes at once</li>
                <li>Auto-numbering & encrypted IDs</li>
                <li>4 ready-to-use design templates + RTL Arabic layout</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Admin Panel</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Track scans, reviews & feedback</li>
                <li>Enable/disable codes</li>
                <li>Customize success/failure pages</li>
                <li>Export reports</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Employee Panel</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Limited access</li>
                <li>QR printing only</li>
                <li>Safe for team use</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Customer Feedback System</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Star ratings (1–5)</li>
                <li>Comments + photo uploads</li>
                <li>Linked directly to QR</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Analytics Dashboard</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Scan rate trends</li>
                <li>Enable/disable ratio</li>
                <li>Pie charts, bar graphs</li>
                <li>Full activity log</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Custom Branding</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Add your logo</li>
                <li>Choose colors for success/failure pages</li>
                <li>Control every message the user sees</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Localized for Algeria */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-50 to-transparent"></div>
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            Made with Algerian Merchants in Mind
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 animate-on-scroll opacity-0">
              <div className="text-blue-600 shrink-0 bg-blue-100 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <p>Arabic (RTL) support</p>
            </div>
            <div className="flex items-start gap-3 animate-on-scroll opacity-0">
              <div className="text-blue-600 shrink-0 bg-blue-100 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <p>Dinar-based pricing</p>
            </div>
            <div className="flex items-start gap-3 animate-on-scroll opacity-0">
              <div className="text-blue-600 shrink-0 bg-blue-100 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <p>BaridiMob / CCP payment</p>
            </div>
            <div className="flex items-start gap-3 animate-on-scroll opacity-0">
              <div className="text-blue-600 shrink-0 bg-blue-100 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <p>Local hosting + privacy compliant</p>
            </div>
            <div className="flex items-start gap-3 animate-on-scroll opacity-0">
              <div className="text-blue-600 shrink-0 bg-blue-100 p-1 rounded-full">
                <CheckCircle size={20} />
              </div>
              <p>Fast setup, no tech skills needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Updated with new price */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 px-4 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMTAgMjBhMiAyIDAgMSAwIDAtNCAxIDEgMCAwIDEgMC0yIDEgMSAwIDAgMSAwIDIgMiAyIDAgMSAwIDAgNHptMTAgMGEyIDIgMCAxIDAgMC00IDEgMSAwIDAgMSAwLTIgMSAxIDAgMCAxIDAgMiAyIDIgMCAxIDAgMCA0em0xMCAwYTIgMiAwIDEgMCAwLTQgMSAxIDAgMCAxIDAtMiAxIDEgMCAwIDEgMCAyIDIgMiAwIDEgMCAwIDR6IiBmaWxsPSIjZTJlOGY0Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            Simple, Transparent Pricing for Every Stage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-bold text-xl mb-1">Starter</h3>
                <p className="text-gray-600 mb-4">For solo entrepreneurs</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">1,200 DZD</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>100 QR Codes / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Limited Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Email Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Link to="/login">Start Free</Link>
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl transform scale-105 relative animate-on-scroll opacity-0">
              <div className="absolute -top-3 left-0 w-full flex justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </div>
              </div>
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="font-bold text-xl mb-1">Pro</h3>
                <p className="text-gray-600 mb-4">For growing businesses</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">2,500 DZD</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>500 QR Codes / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Reviews System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Priority Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-blue-500/25">
                  <Link to="/login">Upgrade Now</Link>
                </Button>
              </div>
            </div>

            {/* Lifetime Plan - Updated price */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="p-6 border-b bg-gradient-to-r from-violet-50 to-blue-50">
                <h3 className="font-bold text-xl mb-1">Lifetime Deal</h3>
                <p className="text-gray-600 mb-4">For agencies & resellers</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">25,000 DZD</span>
                  <span className="text-gray-500 mb-1">one-time</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Unlimited QR Codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Reviews System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Priority Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button asChild variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Link to="/login">Buy Lifetime Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
        <div className="absolute -left-40 top-40 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -right-40 bottom-40 w-80 h-80 bg-violet-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            Merchants Already Love It
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Since using the QR system, my returns dropped by 30%. Customers trust us more."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500"></div>
                <div>
                  <p className="font-medium">Yasmine</p>
                  <p className="text-sm text-gray-500">Local Skincare Brand Owner</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "We use it to collect reviews with every order. Game changer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-500"></div>
                <div>
                  <p className="font-medium">Walid</p>
                  <p className="text-sm text-gray-500">Dropshipper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Security */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-indigo-900 text-white px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxIDAgMS43OTIuNjQgMi4xLjk0bDIuMjcgMi4yOGMuMy4zMS45NCAxLjA1Ljk0IDIuMDYgMCAyLjIxLTEuNzkgNC00IDQtMi4yMDkgMC00LTEuNzktNC00czEuNzkxLTQgNC00eiIgc3Ryb2tlPSIjMzkzZjYwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBmaWxsPSIjMWEyMTNmIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
            Built with the Latest Tech, So You Don't Have to Worry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 animate-on-scroll opacity-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <Lock size={24} className="text-green-400" />
                </div>
                <h3 className="font-bold text-lg">AES-256 Encryption</h3>
              </div>
              <p className="text-gray-300">
                Every QR code is encrypted using industry-standard AES-256, ensuring that product data stays protected from tampering or duplication.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 animate-on-scroll opacity-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <ShieldCheck size={24} className="text-green-400" />
                </div>
                <h3 className="font-bold text-lg">One-Time Validation</h3>
              </div>
              <p className="text-gray-300">
                Each QR code becomes invalid after it's scanned once — preventing reuse or counterfeiting attempts.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 animate-on-scroll opacity-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <Users size={24} className="text-green-400" />
                </div>
                <h3 className="font-bold text-lg">Isolated Permissions</h3>
              </div>
              <p className="text-gray-300">
                Admins control settings, analytics, and feedback. Employees only access QR generation — keeping your data secure from internal leaks.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20 animate-on-scroll opacity-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <CreditCard size={24} className="text-green-400" />
                </div>
                <h3 className="font-bold text-lg">Mobile-First Design</h3>
              </div>
              <p className="text-gray-300">
                Fully responsive and optimized for all devices, ensuring your customers have a seamless experience on any screen size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll opacity-0 text-white">
            Your Products. Verified, Protected, and Trusted.
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100 animate-on-scroll opacity-0">
            Start free. Upgrade anytime. Your brand is worth it.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-on-scroll opacity-0">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all">
              <Link to="/login">Create Your Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/login">Chat With Us on WhatsApp</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-indigo-900 text-white hover:bg-indigo-800 border-none shadow-lg">
              <Link to="/login">Buy Lifetime Deal Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Updated with new links */}
      <footer className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">seQRity</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">BETA</span>
              </h2>
              <p className="text-gray-400 max-w-xs">Protecting brands from counterfeiting with smart technology.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Refund Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 seQRity - QR Code Authentication System. All rights reserved.</p>
            <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
              <span>Made in Algeria with passion</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900/30 text-blue-300 rounded-full">BETA</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
