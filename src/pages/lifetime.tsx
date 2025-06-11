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
import { useNavigate, useLocation } from 'react-router-dom';

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
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: QrCode,
      title: "Unlimited QR Code Generation",
      benefit: "Create unlimited highly customizable QR codes with embedded encryption and anti-counterfeiting measures. Support for URLs, text, contact info, and more."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Real-Time Monitoring",
      benefit: "Get detailed scan analytics with location tracking, device type tracking, time-based analytics, and comprehensive reporting. Monitor everything in real-time."
    },
    {
      icon: Shield,
      title: "Premium Security & Anti-Counterfeiting",
      benefit: "Protect your brand with product authentication, anti-counterfeiting measures, domain verification, and secure infrastructure powered by Supabase."
    },
    {
      icon: Users,
      title: "Customer Engagement System",
      benefit: "Built-in customer reviews system, engagement metrics, integrated feedback system, and user authentication for stronger customer relationships."
    },
    {
      icon: Palette,
      title: "Complete Brand Customization",
      benefit: "Customizable verification pages, brand customization options, white-label solutions, and multi-language support to match your brand perfectly."
    },
    {
      icon: Monitor,
      title: "Cross-Platform Excellence",
      benefit: "Mobile-responsive design, cross-platform compatibility, high availability, scalable architecture, and real-time updates across all devices."
    },
    {
      icon: Headphones,
      title: "Priority Support & Management",
      benefit: "Get priority support, comprehensive account management, product management system, and direct access to help shape Qrified's future."
    },
    {
      icon: Lock,
      title: "All Future Updates Included",
      benefit: "Receive every new feature, security update, and platform improvement we ever release, without paying another dollar. Your investment grows with us."
    }
  ];

  const useCases = [
    "E-commerce Brands: Protect your products from Amazon and eBay counterfeiters.",
    "Luxury Goods: Give your discerning customers absolute certainty in their high-value purchases.",
    "Pharmaceuticals & Supplements: Ensure the safety and authenticity of your products.",
    "Artists & Creators: Authenticate your limited edition prints and creations.",
    "Anyone who wants to build a trusted, direct relationship with their customers."
  ];

  // Add handler for Stripe checkout
  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Create checkout session
      const response = await fetch('https://xowxgbovrbnpsreqgrlt.supabase.co/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1QxYwQwtObNE8T', // Replace with your actual price ID for the lifetime deal
          isLifetime: true // This tells the Edge Function to create a one-time payment
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      navigate('/signup?redirect=lifetime-checkout');
      return;
    }
    await handleBuyNow();
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
              <div className="bg-white/20 rounded-lg p-1 md:p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <div className="text-lg md:text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-xs md:text-sm">Days</div>
              </div>
              <div className="bg-white/20 rounded-lg p-1 md:p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <div className="text-lg md:text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm">Hours</div>
              </div>
              <div className="bg-white/20 rounded-lg p-1 md:p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <div className="text-lg md:text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm">Minutes</div>
              </div>
              <div className="bg-white/20 rounded-lg p-1 md:p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <div className="text-lg md:text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm">Seconds</div>
              </div>
            </div>
          </div>

          <div className="px-2">
            <Button
              onClick={handleClaim}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white text-sm md:text-xl px-4 md:px-12 py-3 md:py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full md:w-auto"
            >
              {isLoading ? 'Processing...' : 'CLAIM MY LIFETIME DEAL - $99 ONE-TIME'}
            </Button>
          </div>
          
          <p className="text-xs md:text-sm text-blue-200 mt-3 px-2">30-Day Money-Back Guarantee</p>
        </div>
      </div>

      {/* App Screenshots Gallery Section */}
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-800/50 py-12 md:py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-6 text-white animate-fade-in px-2">
              See Qrified in Action
            </h2>
            <p className="text-sm md:text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in animation-delay-300 px-4">
              Explore our powerful interface and discover how Qrified transforms product authenticity management
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {screenshots.map((screenshot, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer group">
                          <img
                            src={screenshot}
                            alt={`Qrified App Screenshot ${index + 1}`}
                            className="w-full h-48 md:h-64 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                        <div className="relative">
                          <img
                            src={screenshot}
                            alt={`Qrified App Screenshot ${index + 1}`}
                            className="w-full h-auto max-h-[85vh] object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Founder's Message */}
      <div className="bg-gradient-to-br from-slate-800/80 to-blue-900/80 py-12 md:py-20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-blue-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white animate-fade-in px-2">
              A Message from the Heart of Qrified
            </h2>
            
            <Card className="p-3 md:p-8 shadow-xl border-0 bg-slate-800/90 backdrop-blur-md hover:shadow-2xl transition-all duration-500 animate-scale-in mx-2">
              <CardContent className="space-y-3 md:space-y-6 text-sm md:text-lg leading-relaxed text-slate-100 p-0">
                <p>
                  My name is <strong className="text-white">Soufiane</strong>, and for the past months, Qrified has been my singular obsession. As a solo founder, I've poured my heart, my savings, and countless sleepless nights into building a tool that I believe can fundamentally change how businesses build trust with their customers.
                </p>
                
                <p>
                  Qrified is more than just code to me; it's a solution to a problem I've seen firsthand – the erosion of brand trust in an age of counterfeits and disconnected customer experiences. I've designed it to be the gold standard for product authenticity, a way for legitimate businesses to stand out and for customers to feel confident in their purchases.
                </p>
                
                <p>
                  Now, I stand at a crossroads. To take Qrified to the next level, to continue to innovate and build upon this dream, I need to prove that this business is viable. And I have just one week to do it.
                </p>
                
                <p>
                  That's why I'm offering something I'll never be able to offer again: <strong className="text-pink-300">lifetime access to Qrified for a single, one-time payment of $99</strong>.
                </p>
                
                <p>
                  This isn't a typical marketing gimmick. This is a foundational event. Your $99 is more than just a purchase; it's a vote of confidence. It's the fuel that will allow me to grow this platform, add even more powerful features, and dedicate myself fully to serving you, my foundational customers.
                </p>
                
                <p>
                  By securing this deal, you're not just getting an incredible tool at an unbeatable price. You are becoming a part of the Qrified story. You are directly supporting a founder's dream and helping to build a company that is committed to authenticity and trust.
                </p>
                
                <p className="text-center font-semibold text-lg md:text-xl text-pink-300">
                  From the bottom of my heart, thank you for considering this. I hope you'll join me on this journey.
                </p>
                
                <div className="text-right">
                  <p className="font-semibold text-white">Warmly,</p>
                  <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Soufiane</p>
                  <p className="text-slate-300">Founder, Qrified.app</p>
                  <div className="flex justify-end space-x-4 mt-4">
                    <a 
                      href="https://www.linkedin.com/in/soufianehm/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-blue-900/80 to-slate-900/80 py-12 md:py-20 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl animate-fade-in"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-fade-in animation-delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 text-white animate-fade-in px-2">
              The Complete Qrified Platform
            </h2>
            <p className="text-sm md:text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in animation-delay-300 px-4">
              For a single, one-time payment of $99, you'll receive lifetime access to our entire platform. Here's what you'll get:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8 mb-8 md:mb-12 px-2">
            {features.map((feature, index) => (
              <Card key={index} className="p-3 md:p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 border-0 bg-slate-800/60 backdrop-blur-sm animate-fade-in group" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="space-y-2 md:space-y-4 p-0">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-4">
                    <div className="bg-gradient-to-r from-pink-500/20 to-blue-500/20 p-1 md:p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                      <feature.icon className="h-4 w-4 md:h-6 md:w-6 text-pink-300" />
                    </div>
                    <h3 className="text-sm md:text-xl font-semibold text-white leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-xs md:text-base text-blue-100 leading-relaxed">{feature.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center px-2">
            <Button className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white text-sm md:text-xl px-4 md:px-12 py-3 md:py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full md:w-auto" onClick={handleClaim}>
              CLAIM MY LIFETIME DEAL - $99 ONE-TIME
            </Button>
            <p className="text-xs md:text-sm text-blue-200 mt-3">Price returns to $49/month after this offer ends.</p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 py-12 md:py-20 relative backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-4xl font-bold mb-8 md:mb-12 text-white animate-fade-in px-2">
              Join the Movement to Build a More Authentic World
            </h2>
            
            <div className="mb-8 md:mb-12 px-2">
              <h3 className="text-lg md:text-2xl font-semibold mb-6 md:mb-8 text-blue-100 animate-fade-in animation-delay-300">Qrified is perfect for:</h3>
              <div className="space-y-2 md:space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start space-x-2 md:space-x-3 text-left animate-slide-in-right group" style={{animationDelay: `${index * 100}ms`}}>
                    <Check className="h-4 w-4 md:h-6 md:w-6 text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-xs md:text-lg text-blue-100 group-hover:text-white transition-colors duration-300">{useCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-pink-700 to-purple-800 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-700/90 to-purple-800/90"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-fade-in"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-fade-in animation-delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-2xl md:text-5xl font-bold mb-6 md:mb-8 animate-fade-in px-2">
            The Clock is Ticking... Don't Miss Your Only Chance.
          </h2>
          
          <div className="max-w-4xl mx-auto mb-8 md:mb-12 px-2">
            <p className="text-sm md:text-xl mb-4 md:mb-6 leading-relaxed animate-fade-in animation-delay-300">
              This isn't a recurring sale. It's a one-time event to build the foundation of a company I'm deeply passionate about. When the timer on this page hits zero, this lifetime offer will be gone forever, and the price will revert to our standard monthly subscription.
            </p>
            
            <p className="text-sm md:text-xl mb-6 md:mb-8 leading-relaxed animate-fade-in animation-delay-500">
              This is your chance to get in on the ground floor and secure a powerful tool that will grow with your business for years to come.
            </p>
            
            <Card className="bg-white/10 border-white/20 p-3 md:p-8 mb-6 md:mb-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 animate-scale-in animation-delay-700">
              <CardContent className="p-0">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">The Qrified Founder's Promise:</h3>
                <p className="text-xs md:text-lg">
                  I am so confident that Qrified will become an invaluable asset to your business that I'm offering a no-questions-asked, 30-day money-back guarantee. If you're not completely satisfied, just send me an email, and I'll personally process your full refund.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="px-2">
            <Button className="bg-white text-pink-700 hover:bg-gray-100 text-sm md:text-xl px-4 md:px-12 py-3 md:py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-bold w-full md:w-auto" onClick={handleClaim}>
              SECURE MY LIFETIME ACCESS & PROTECT MY BRAND
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 md:py-12 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">QRIFIED</h3>
            <p className="text-sm md:text-base text-blue-200 mb-4 md:mb-6 max-w-2xl mx-auto animate-fade-in animation-delay-300">
              The gold standard for product authenticity and anti-counterfeiting through secure, dynamic QR codes.
            </p>
            
            {/* Company Registration Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 md:p-4 mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-400">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-green-400 mr-2" />
                <span className="text-sm md:text-base font-semibold text-green-400">Registered UK Company</span>
              </div>
              <div className="text-xs md:text-sm text-blue-200 space-y-1">
                <p>QRified.app Ltd. | Company No. 15374908</p>
                <p>3173 275 New N Rd, London N1 7AA, United Kingdom</p>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex justify-center space-x-4 md:space-x-6 mb-4 md:mb-6 animate-fade-in animation-delay-500">
              <a 
                href="https://instagram.com/qrified.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-pink-400 transition-all duration-300 hover:scale-110 transform"
              >
                <Instagram className="h-6 w-6 md:h-8 md:w-8" />
              </a>
              <a 
                href="https://tiktok.com/@qrified" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-all duration-300 hover:scale-110 transform"
              >
                <svg className="h-6 w-6 md:h-8 md:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-1.183-.11 6.44 6.44 0 106.44 6.44V8.206a8.238 8.238 0 004.976 1.686v-3.206z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/soufianehm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 transition-all duration-300 hover:scale-110 transform"
              >
                <Linkedin className="h-6 w-6 md:h-8 md:w-8" />
              </a>
            </div>
            
            <div className="space-y-2 mb-6 md:mb-8 animate-fade-in animation-delay-700">
              <p className="text-sm md:text-base">Contact: contact@qrified.app</p>
              <div className="space-x-2 md:space-x-4 text-sm">
                <span className="text-blue-300 hover:text-white transition-colors cursor-pointer">Privacy</span>
                <span className="text-blue-300">|</span>
                <span className="text-blue-300 hover:text-white transition-colors cursor-pointer">Terms</span>
                <span className="text-blue-300">|</span>
                <span className="text-blue-300 hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-blue-300 animate-fade-in animation-delay-900">
              © 2025 Qrified. All rights reserved. | London, England
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifetimePage; 