import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, BarChart3, Lock, Headphones, Palette, Zap, Instagram, Linkedin, QrCode, Users, Monitor, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStripe, createCheckoutSession } from '@/integrations/stripe/client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LifetimePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 22
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // App screenshots for the gallery
  const screenshots = [
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(9).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(8).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(7).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(6).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(5).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(4).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(3).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(2).png",
    "https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1%20(1).png"
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: QrCode, title: "Unlimited QR Code Generation", benefit: "Create unlimited highly customizable QR codes with embedded encryption and anti-counterfeiting measures. Support for URLs, text, contact info, and more." },
    { icon: BarChart3, title: "Advanced Analytics & Real-Time Monitoring", benefit: "Get detailed scan analytics with location tracking, device type tracking, time-based analytics, and comprehensive reporting. Monitor everything in real-time." },
    { icon: Shield, title: "Premium Security & Anti-Counterfeiting", benefit: "Protect your brand with product authentication, anti-counterfeiting measures, domain verification, and secure infrastructure powered by Supabase." },
    { icon: Users, title: "Customer Engagement System", benefit: "Built-in customer reviews system, engagement metrics, integrated feedback system, and user authentication for stronger customer relationships." },
    { icon: Palette, title: "Complete Brand Customization", benefit: "Customizable verification pages, brand customization options, white-label solutions, and multi-language support to match your brand perfectly." },
    { icon: Monitor, title: "Cross-Platform Excellence", benefit: "Mobile-responsive design, cross-platform compatibility, high availability, scalable architecture, and real-time updates across all devices." },
    { icon: Headphones, title: "Priority Support & Management", benefit: "Get priority support, comprehensive account management, product management system, and direct access to help shape Qrified's future." },
    { icon: Lock, title: "All Future Updates Included", benefit: "Receive every new feature, security update, and platform improvement we ever release, without paying another dollar. Your investment grows with us." }
  ];

  const useCases = [
    "E-commerce Brands: Protect your products from Amazon and eBay counterfeiters.",
    "Luxury Goods: Give your discerning customers absolute certainty in their high-value purchases.",
    "Pharmaceuticals & Supplements: Ensure the safety and authenticity of your products.",
    "Artists & Creators: Authenticate your limited edition prints and creations.",
    "Anyone who wants to build a trusted, direct relationship with their customers."
  ];

  // UPDATED: All plans are now one-time payments
  const oneTimePlans = [
    {
      name: "Premium",
      description: "A powerful one-time purchase for enterprise-grade control.",
      price: 199,
      // NOTE: This Product ID in Stripe should correspond to a one-time payment product.
      productId: "prod_SQ7xkoPstFb6EW", 
      features: [
        { name: "Up to 100,000 QR Codes", included: true },
        { name: "Use Your Own Custom Domain", included: true },
        { name: "Customizable Analytics Dashboard", included: true },
        { name: "Up to 5 Team Members", included: true },
        { name: "Priority Support Queue", included: true },
      ],
      recommended: false,
      ctaText: "Buy Premium"
    },
    {
      name: "Premium Plus",
      description: "The ultimate package with expanded limits and features.",
      price: 299,
      // NOTE: This Product ID in Stripe should correspond to a one-time payment product.
      productId: "prod_ST3hw6HjjE2lnz",
      features: [
        { name: "Up to 250,000 QR Codes", included: true },
        { name: "All features from Premium", included: true },
        { name: "API Access", included: true },
        { name: "Up to 15 Team Members", included: true },
        { name: "Dedicated Onboarding Support", included: true },
      ],
      recommended: true,
      ctaText: "Buy Premium Plus"
    }
  ];

  const handleCheckout = async (productId: string) => {
    if (!isAuthenticated) {
      navigate('/signup?redirect=lifetime-checkout');
      return;
    }
    try {
      setIsLoading(true);
      const sessionId = await createCheckoutSession(productId);
      const stripe = await getStripe();
      if (!stripe) throw new Error('Failed to load Stripe');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-xl animate-fade-in"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-fade-in animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-400/20 rounded-full blur-xl animate-fade-in animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <Badge className="mb-4 md:mb-6 text-xs md:text-lg px-3 md:px-6 py-1 md:py-2 bg-gradient-to-r from-pink-600 to-red-600 text-white border-0 shadow-lg">
            FINAL OPPORTUNITY - LIMITED TIME
          </Badge>
          
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight animate-scale-in px-2">
            Qrified.app Lifetime Access
          </h1>
          
          <p className="text-lg md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4 text-white animate-fade-in animation-delay-300 px-2">
            Your Unprecedented & Final Opportunity for Just $99
          </p>
          
          <p className="text-sm md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed px-4 animate-fade-in animation-delay-500">
            This isn't just a deal; it's the foundation of our journey. For the first and only time, secure lifetime access to the ultimate tool for product authenticity and customer connection. When this timer hits zero, this offer is gone forever.
          </p>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl md:rounded-2xl p-3 md:p-8 mb-6 md:mb-8 shadow-2xl animate-scale-in animation-delay-700 hover:scale-105 transition-transform duration-300 mx-2">
            <h3 className="text-base md:text-2xl font-bold mb-3 md:mb-4">DEAL ENDS IN:</h3>
            <div className="grid grid-cols-4 gap-1 md:gap-4 text-center max-w-md mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/20 rounded-lg p-1 md:p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                  <div className="text-lg md:text-3xl font-bold">{value}</div>
                  <div className="text-xs md:text-sm capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2">
            <Button
              onClick={() => handleCheckout('prod_STZYwQwtObNE8T')} // Lifetime Product ID
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white text-sm md:text-xl px-4 md:px-12 py-3 md:py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full md:w-auto"
            >
              {isLoading ? 'Processing...' : 'CLAIM MY LIFETIME DEAL - $99 ONE-TIME'}
            </Button>
          </div>
          
          <p className="text-xs md:text-sm text-blue-200 mt-3 px-2">30-Day Money-Back Guarantee</p>
        </div>
      </div>

      {/* UPDATED: Choose a Plan Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            Choose Your Perfect One-Time Plan
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Select our limited-time lifetime deal or another powerful one-time payment option.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Lifetime Deal Card */}
          <motion.div
            className="relative bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl p-8 shadow-2xl"
          >
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <div className="px-4 py-1 bg-yellow-400 text-black text-sm font-bold rounded-full">LIMITED TIME OFFER</div>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Lifetime Access</h3>
            <div className="mb-6 flex items-end">
              <span className="text-5xl font-bold text-white">$99</span>
              <span className="text-white/80 ml-2 mb-1">one-time</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["All Premium Features", "All Future Updates", "No Recurring Payments"].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => handleCheckout('prod_STZYwQwtObNE8T')} disabled={isLoading} className="w-full bg-white text-pink-600 hover:bg-white/90 text-lg font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              {isLoading ? 'Processing...' : 'CLAIM LIFETIME DEAL'}
            </Button>
          </motion.div>

          {/* Premium One-Time Plan Cards */}
          {oneTimePlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-neutral-900/50 backdrop-blur-sm border ${ plan.recommended ? 'border-primary-500' : 'border-neutral-800' } rounded-xl p-8`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">Best Value</div>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="mb-6 flex items-end">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-neutral-400 ml-2 mb-1">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-neutral-300">{feature.name}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleCheckout(plan.productId)} disabled={isLoading} className={`w-full ${ plan.recommended ? 'bg-primary-500 hover:bg-primary-600' : 'bg-neutral-800 hover:bg-neutral-700' } text-white text-lg font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                {isLoading ? 'Processing...' : plan.ctaText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The rest of your page components (App Screenshots, Founder's Message, etc.) remain unchanged */}
    </div>
  );
};

export default LifetimePage;
