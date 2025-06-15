import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, BarChart3, Lock, Headphones, Palette, Zap, Instagram, Linkedin, QrCode, Users, Monitor, Globe, X, DollarSign, Star } from "lucide-react";
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
import { getLifetimeTimer, type TimerResponse } from '@/lib/api/timer';

const LifetimePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  const [timerEndDate, setTimerEndDate] = useState<Date | null>(null);
  const [timerError, setTimerError] = useState<string | null>(null);

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

  // Replace the product image URLs in the animated product marquee section
  const productMarqueeImages = [
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28accff0a8f58bb7af37e_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%206-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acb342eee9a35f219cc_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%207.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acb1eed7d0635ab9904_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%208.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acb7c1c340fafd5b7d8_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%209.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acbcc107ba16b420aa2_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2010.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acbcbcacfd8f198d1f9_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2011.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acccda7db3ba89fb947_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2012.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acb3828d23d57f4b318_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%206.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acd4d16b9bd69ca7bff_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%207-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc66a8144c112742ae_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%208-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc18569c8b3e473aaa_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%209-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc18569c8b3e473ae5_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2010-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acdcbeec90dc9b0dc01_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2011-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28accc82245da08843df2_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2012-1.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acb50fd60df687d8d2a_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%207-2.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc3828d23d57f4b351_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%208-2.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc8cd4fe3436109666_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%209-2.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28accc82245da08843e64_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2010-2.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc61b757711065f74e_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2011-2.avif",
    "https://cdn.prod.website-files.com/6668551da3a255b9631ffddf/67e28acc1b63d37e0878c693_8451c507-d7fe-4ec9-960c-1a67ac6bfb28%2012-2.avif"
  ];

  // Fetch timer end date on component mount
  useEffect(() => {
    const fetchTimer = async () => {
      console.log("Attempting to fetch lifetime timer...");
      const response = await getLifetimeTimer();
      console.log("Timer API response:", response);
      if (response.error) {
        setTimerError(response.error);
        // Set a fallback timer (7 days from now)
        const fallbackDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        setTimerEndDate(fallbackDate);
        console.log("Using fallback timer end date:", fallbackDate.toISOString());
      } else {
        const fetchedDate = new Date(response.endDate);
        setTimerEndDate(fetchedDate);
        console.log("Fetched timer end date:", fetchedDate.toISOString());
      }
    };

    fetchTimer();
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!timerEndDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = timerEndDate.getTime();
      const distance = end - now;

      if (distance < 0) {
        // Timer has ended
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const timer = setInterval(updateTimer, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [timerEndDate]);

  const features = [
    { icon: QrCode, title: "100k QR Code Generation", benefit: "Generate 100,000 highly customizable QR codes monthly with embedded encryption and anti-counterfeiting measures. Support for URLs, text, contact info, and more." },
    { icon: BarChart3, title: "Advanced Analytics System", benefit: "Get detailed scan analytics with location tracking, device type tracking, time-based analytics, and comprehensive reporting. Monitor everything in real-time." },
    { icon: Shield, title: "Premium Security & Anti-Counterfeiting", benefit: "Protect your brand with product authentication, anti-counterfeiting measures, domain verification, and secure infrastructure powered by Supabase." },
    { icon: Palette, title: "Customizable Templates & Branding", benefit: "Choose from 4 different printable templates or design your own. Fully white-label your QR codes, verification pages, and reports with your brand's colors and logo." },
    { icon: Lock, title: "Secure Verification Pages", benefit: "Full verification page customization, allowing you to control the user experience and display product information, authenticity status, and more." },
    { icon: Headphones, title: "Priority Support & Future Updates", benefit: "Access our priority support queue for quick assistance. Receive all future updates and new features at no additional cost." },
  ];

  const useCases = [
  ];

  // Add handler for Stripe checkout
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/signup?redirect=lifetime-checkout');
      return;
    }
    try {
      setIsLoading(true);
      const sessionId = await createCheckoutSession('prod_STZYwQwtObNE8T');
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

  const handleClaim = async () => {
    if (!isAuthenticated) {
      navigate('/signup?redirect=lifetime-checkout');
      return;
    }
    try {
      setIsLoading(true);
      const sessionId = await createCheckoutSession('prod_STZYwQwtObNE8T');
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

  // This function is no longer needed as there are no other premium plans.
  const handlePremiumCheckout = async (plan: any) => {};

  const perks = [
    {
      img: "https://via.placeholder.com/120x80?text=Instant+Verification",
      title: "Instant Verification",
      desc: "Verify your products instantly with a scan. Qrified makes it easy for your customers to check authenticity in seconds."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Analytics",
      title: "Actionable Analytics",
      desc: "Get real-time insights on scans, locations, and user engagement to optimize your campaigns and product launches."
    },
    {
      img: "https://via.placeholder.com/120x80?text=No+App+Needed",
      title: "No App Needed",
      desc: "Your customers can verify products using any smartphone camera—no special app required, just scan and go."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Brand+Control",
      title: "Full Brand Control",
      desc: "Customize your QR codes and verification pages to match your brand, including logo, colors, and messaging."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Save+Time+%26+Money",
      title: "Save Time & Money",
      desc: "Automate product authentication and tracking, reduce manual work, and protect your business from costly counterfeits."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Global+Reach",
      title: "Global Reach",
      desc: "Qrified supports multi-language QR codes and verification pages, helping you connect with customers worldwide."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Easy+Integration",
      title: "Easy Integration",
      desc: "Seamlessly integrate Qrified with your existing systems and workflows for a smooth authentication process."
    },
    {
      img: "https://via.placeholder.com/120x80?text=Customer+Trust",
      title: "Customer Trust",
      desc: "Build trust with your customers by providing transparent, verifiable product information at their fingertips."
    },
    {
      img: "https://via.placeholder.com/120x80?text=24%2F7+Support",
      title: "24/7 Support",
      desc: "Our team is always here to help you with any questions or issues, any time of day."
    }
  ];

  function PerksSection() {
    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
      const scroll = scrollRef.current;
      if (!scroll) return;
      const onMouseDown = (e) => {
        isDown.current = true;
        scroll.classList.add('active');
        startX.current = e.pageX - scroll.offsetLeft;
        scrollLeft.current = scroll.scrollLeft;
      };
      const onMouseLeave = () => {
        isDown.current = false;
        scroll.classList.remove('active');
      };
      const onMouseUp = () => {
        isDown.current = false;
        scroll.classList.remove('active');
      };
      const onMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scroll.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        scroll.scrollLeft = scrollLeft.current - walk;
      };
      scroll.addEventListener('mousedown', onMouseDown);
      scroll.addEventListener('mouseleave', onMouseLeave);
      scroll.addEventListener('mouseup', onMouseUp);
      scroll.addEventListener('mousemove', onMouseMove);
      return () => {
        scroll.removeEventListener('mousedown', onMouseDown);
        scroll.removeEventListener('mouseleave', onMouseLeave);
        scroll.removeEventListener('mouseup', onMouseUp);
        scroll.removeEventListener('mousemove', onMouseMove);
      };
    }, []);

    const scrollBy = (amount) => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      }
    };

    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">Perks of Qrified</h2>
              <p className="text-gray-600 text-lg max-w-2xl">Built by product creators for product creators, Qrified empowers you to secure, track, and grow your business with confidence.</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button onClick={() => scrollBy(-340)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"><span>&lt;</span></button>
              <button onClick={() => scrollBy(340)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"><span>&gt;</span></button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing py-2"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {perks.map((perk, idx) => (
              <div key={idx} className="min-w-[320px] max-w-xs bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col items-start scroll-snap-align-start">
                <div className="w-full h-32 bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <img src={perk.img} alt={perk.title} className="object-contain w-full h-full" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{perk.title}</h3>
                <p className="text-gray-600 text-sm">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation (simplified for now) */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <QrCode className="h-8 w-8 text-purple-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Qrified</span>
      </div>
        <nav className="hidden md:flex space-x-6 text-sm">
          <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Testimonials</a>
          <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
          <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
        </nav>
      </header>

      {/* Timer Section */}
      {timerEndDate && (
        <div className="w-full py-4 bg-purple-100 text-center text-purple-800 font-bold text-xl md:text-2xl tracking-wide shadow-md">
          <p>Offer ends in: </p>
          <p className="mt-2 text-3xl md:text-5xl font-extrabold text-purple-900 animate-pulse">
            {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
          </p>
          {timerError && <p className="text-red-500 text-sm mt-2">Error: {timerError}</p>}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-white">
        <div className="absolute inset-0 bg-hero-pattern opacity-10 blur-xl"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-gray-900">
            Secure QR Code Solutions for a <span className="text-purple-600">Safer World</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto animate-fade-in animate-delay-300">
            Generate 100k QR Codes Monthly For Life Forever. That's One Hundred Thousand Orders Per Month. Don't worry about it if you need more we will provide more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in animate-delay-500">
            <Button
              onClick={handleBuyNow}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              GET ME MY LIFETIME OFFER            </Button>
          </div>
          
          {/* Main Screenshot Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200"
            style={{ backgroundImage: `url(${screenshots[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>
        </div>
      </section>

      {/* Applicable Categories */}
      <div className="mt-12 text-center relative z-20 mt-[-200px] bg-white p-8 rounded-xl">
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-900 text-sm font-semibold uppercase">Applicable to Everyone</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex flex-wrap justify-center text-gray-700 text-sm font-medium leading-relaxed mt-4">
          <span className="mx-2 whitespace-nowrap">Small E-commerce Brands & Dropshippers</span>
          <span className="text-gray-400">|</span>
          <span className="mx-2 whitespace-nowrap">Perfumes, Cosmetics & Supplements Brands</span>
          <span className="text-gray-400">|</span>
          <span className="mx-2 whitespace-nowrap">Large Manufacturers & Wholesalers</span>
          <span className="text-gray-400">|</span>
          <span className="mx-2 whitespace-nowrap">Luxury Goods & Collectibles</span>
        </div>
      </div>
{/* New Section: Generate QR Codes in one click */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full lg:w-[600px] h-auto aspect-video rounded-lg shadow-lg border border-gray-200 bg-white flex items-center justify-center">
              <img
                src="https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//Screenshot%202025-06-15%20101743.png"
                alt="QR Code Generation"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Right Column: Text and Button */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Generate QR Codes in one click
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Effortlessly create custom QR codes for all your products and marketing needs. Our intuitive system allows you to generate secure, verifiable QR codes instantly, protecting your brand from counterfeits and enhancing customer trust with a single click.
            </p>
            <Button
              onClick={handleBuyNow} // Reusing existing handler
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get your lifetime deal
            </Button>
          </div>
        </div>
      </section>
          {/* New Section: Secure Every Product */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text and Button */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              We can secure every product
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              as long as you can stick the sticker of qr code verification to it it will definitely be secured with qrified secure anti fraud system
            </p>
            <Button
              onClick={handleBuyNow} // Reusing existing handler
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get the lifetime offer
            </Button>
          </div>

          {/* Right Column: Animated Product Images */}
          <div className="relative overflow-hidden py-4 rounded-[5%] border border-gray-200 shadow-lg">
            {/* Row 1: Leftward scroll */}
            <motion.div
              className="flex items-center gap-3"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
              style={{ width: '200%' }}
            >
              {[...productMarqueeImages, ...productMarqueeImages].map((image, i) => (
                <div key={`row1-${i}`} className="flex-shrink-0 w-20 h-20 rounded-lg shadow-md border border-gray-200 flex items-center justify-center bg-white">
                  <img
                    src={image}
                    alt={`Product ${i + 1}`}
                    className="w-16 h-16 rounded-md object-cover"
                    draggable="false"
                  />
                </div>
              ))}
            </motion.div>

            {/* Row 2: Rightward scroll (slightly delayed) */}
            <motion.div
              className="flex items-center gap-3 mt-4"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 18, delay: -9 }}
              style={{ width: '200%' }}
            >
              {[...productMarqueeImages, ...productMarqueeImages].map((image, i) => (
                <div key={`row2-${i}`} className="flex-shrink-0 w-20 h-20 rounded-lg shadow-md border border-gray-200 flex items-center justify-center bg-white">
                  <img
                    src={image}
                    alt={`Product ${i + 1}`}
                    className="w-16 h-16 rounded-md object-cover"
                    draggable="false"
                          />
                        </div>
              ))}
            </motion.div>

            {/* Row 3: Leftward scroll (slightly delayed) */}
            <motion.div
              className="flex items-center gap-3 mt-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 18, delay: -18 }}
              style={{ width: '200%' }}
            >
              {[...productMarqueeImages, ...productMarqueeImages].map((image, i) => (
                <div key={`row3-${i}`} className="flex-shrink-0 w-20 h-20 rounded-lg shadow-md border border-gray-200 flex items-center justify-center bg-white">
                  <img
                    src={image}
                    alt={`Product ${i + 1}`}
                    className="w-16 h-16 rounded-md object-cover"
                    draggable="false"
                          />
                        </div>
                ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Track QR Code Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12">
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
              Track Every QR Code, <span className="text-purple-600">Single or in a Dashboard</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto lg:mx-0">
              Track every QR code, single or in a dashboard. Add some description here add some description here add some description. nomnom description here.
            </p>
            <Button
              onClick={handleBuyNow}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Lifetime deal expiring soon
            </Button>
          </div>

          {/* Right Column - Dashboard Image */}
          <div className="w-full lg:w-1/2 relative p-8 bg-gray-50 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center">
            <img
              src="https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//Screenshot%202025-06-13%20015904.png"
              alt="Dashboard Placeholder"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Qrified Features Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900">
            Qrified Features
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-12">
            Super power your verification with these features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1: Reviews and Feedback System */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Reviews+Feedback" alt="Reviews and Feedback System" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">reviews and feedback system <Badge variant="destructive" className="bg-red-500">HOT</Badge></h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Instantly generate QR codes that link to your review platforms or custom feedback forms. Gather valuable customer insights by allowing users to scan and share their opinions in seconds. Track the performance of your feedback QR codes to see which channels are most effective.              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
              </a>
            </div>

            {/* Feature Card 2: Custom Domain */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Custom+Domain" alt="Custom Domain" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom domain <Badge className="bg-blue-500">NEW</Badge></h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Brand your QR codes with a custom domain to build trust and recognition. When users scan your QR code, they'll see a familiar URL, reinforcing your brand identity and increasing engagement. Stand out from the competition with professional and secure QR code links.
              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
              </a>
            </div>

            {/* Feature Card 3: Geolocation and Device Tracking */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Geolocation+Tracking" alt="Geolocation and Device Tracking" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Geolocation and device tracking</h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Gain powerful insights into when and where your QR codes are being scanned. Understand your audience better by analyzing geographic data and the types of devices used to scan your codes. Optimize your campaigns by targeting locations with the highest engagement.
              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
              </a>
            </div>

            {/* Feature Card 4: Detailed Scan Logs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Scan+Logs" alt="Detailed Scan Logs" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">detailed scan logs</h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Access comprehensive and easy-to-understand logs of all your QR code scans. See a detailed history of every scan, including the time, location, and device, to monitor the activity and effectiveness of your QR codes in real-time.
              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
              </a>
            </div>

            {/* Feature Card 5: Real-time Suspicious Activity Tracker */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Activity+Tracker" alt="Real-time Suspicious Activity Tracker" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real time suspicious activity tracker</h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Protect your users and your brand with our advanced security features. Receive instant alerts for any unusual or suspicious scanning activity, such as multiple scans from the same IP address in a short period, helping to prevent misuse of your QR codes.
              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
              </a>
            </div>

            {/* Feature Card 6: Full Customization / Multi-Language Support */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-start text-left">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://via.placeholder.com/300x192?text=Customization+Support" alt="Full Customization / Multi-Language Support" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Full customization / multi language support</h3>
              <p className="text-gray-700 mb-4 flex-grow">
              Create QR codes that perfectly match your brand's look and feel. Customize everything from the colors and shape to adding your own logo. Reach a global audience with multi-language support, allowing you to create QR codes with content in various languages.
              </p>
              <a href="#" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center">
                Explore Details <span className="ml-1 text-sm">›</span>
                    </a>
                  </div>
                </div>
        </div>
      </section>

      {/* Qrified Community Section */}
      <section className="py-10 md:py-16 px-2">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'url(\"data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'none\'/%3E%3Cg stroke=\'%23ffffff22\' stroke-width=\'1\'%3E%3Cline x1=\'0\' y1=\'40\' x2=\'100%25\' y2=\'40\'/%3E%3Cline x1=\'0\' y1=\'80\' x2=\'100%25\' y2=\'80\'/%3E%3Cline x1=\'0\' y1=\'120\' x2=\'100%25\' y2=\'120\'/%3E%3Cline x1=\'40\' y1=\'0\' x2=\'40\' y2=\'100%25\'/%3E%3Cline x1=\'80\' y1=\'0\' x2=\'80\' y2=\'100%25\'/%3E%3Cline x1=\'120\' y1=\'0\' x2=\'120\' y2=\'100%25\'/%3E%3C/g%3E%3C/svg%3E\")', opacity: 0.2, zIndex: 0}}></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-20 gap-12">
            {/* Left: Text */}
            <div className="flex-1 text-white max-w-xl">
              <h2 className="text-2xl md:text-4xl font-extrabold mb-4">By Sellers to Sellers, We know the struggles!</h2>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Take advantage of Qrified's advanced QR code tools to make your product authentication, tracking, and customer engagement easier—while increasing your brand's security and success.
              </p>
              <Button
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition"
                onClick={handleBuyNow}
              >
                Get Your Lifetime Access
              </Button>
            </div>
            {/* Right: Image */}
            <div className="flex-1 flex justify-center items-center mt-8 lg:mt-0 lg:ml-12">
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-md aspect-video rounded-2xl bg-blue-900 flex items-center justify-center border-4 border-blue-400/30 shadow-lg">
                <img
                  src="https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//svgviewer-output%20(3).webp"
                  alt="Qrified Community"
                  className="object-contain w-full h-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Move PerksSection here */}
      {PerksSection()}

      {/* Qrified Urgency Trial Section */}
      <section className="py-12 pr-2 pl-2 md:py-20 px-0">
        <div className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden flex flex-col items-center text-center shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'url(\"data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'none\'/%3E%3Cg stroke=\'%23ffffff22\' stroke-width=\'1\'%3E%3Cline x1=\'0\' y1=\'40\' x2=\'100%25\' y2=\'40\'/%3E%3Cline x1=\'0\' y1=\'80\' x2=\'100%25\' y2=\'80\'/%3E%3Cline x1=\'0\' y1=\'120\' x2=\'100%25\' y2=\'120\'/%3E%3Cline x1=\'40\' y1=\'0\' x2=\'40\' y2=\'100%25\'/%3E%3Cline x1=\'80\' y1=\'0\' x2=\'80\' y2=\'100%25\'/%3E%3Cline x1=\'120\' y1=\'0\' x2=\'120\' y2=\'100%25\'/%3E%3C/g%3E%3C/svg%3E\")', opacity: 0.2, zIndex: 0}}></div>
          <div className="relative z-10 w-full flex flex-col items-center py-10 px-4 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">Try Qrified with a Lifetime Deal – Time is Running Out!</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Perfect for anyone looking to secure their products and brand. Explore all our tools, risk-free, with no commitment—this exclusive lifetime offer is about to expire!
            </p>
            <div className="flex flex-col items-center mb-6">
              <span className="uppercase tracking-widest text-blue-200 text-sm font-semibold mb-2">Hurry! Limited Time Left</span>
              <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl px-8 py-6 shadow-inner border border-blue-200">
                <span className="text-lg md:text-2xl font-bold text-white mb-2">Offer ends in:</span>
                <span className="text-4xl md:text-6xl font-extrabold text-yellow-300 drop-shadow animate-pulse">
                  {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
                </span>
                {timerError && <span className="text-red-200 text-xs mt-2">Error: {timerError}</span>}
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 text-blue-100 text-base font-medium mb-8">
              <span className="flex items-center gap-2"><Check className="w-5 h-5 text-white" /> Try today</span>
              <span className="text-blue-200">•</span>
              <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-white" /> 100% risk-free</span>
              <span className="text-blue-200">•</span>
              <span className="flex items-center gap-2"><X className="w-5 h-5 text-white" /> Cancel anytime</span>
            </div>
            <Button
              className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg shadow hover:bg-blue-50 transition text-lg"
              onClick={handleBuyNow}
            >
              Try For Free
            </Button>
          </div>
        </div>
      </section>

     
      {/* Features Section */}
      <section id="features" className="bg-white py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
What Do You Get For 99$           </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              For a single, one-time payment of $99, you'll receive lifetime access to our entire platform, including 100,000 QR codes monthly for life! If you need more, we will provide more. Here's what you'll get:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 md:mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200 bg-white group">
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed">{feature.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300" onClick={handleClaim}>
              CLAIM MY LIFETIME DEAL - $99 ONE-TIME
            </Button>
            <p className="text-sm text-gray-600 mt-3">Price returns to $49/month after this offer ends.</p>
          </div>
        </div>
      </section>

     
      <div className="w-full py-4 bg-purple-100 text-center text-purple-800 font-bold text-xl md:text-2xl tracking-wide shadow-md">
          <p className="mt-2 text-3xl md:text-5xl font-extrabold text-purple-900 animate">
              Join the Movement to Build a More Authentic World
          </p>
        </div>

      {/* Your Exclusive Lifetime Offer Section */}
      <section id="pricing" className="bg-white py-12 md:py-20 relative z-10">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Your Exclusive Lifetime Offer
          </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Secure your unprecedented lifetime access to Qrified.
          </p>
        </div>

        <div className="flex justify-center max-w-7xl mx-auto">
          {/* Lifetime Deal Card */}
          <motion.div
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
              className="relative bg-white rounded-xl p-8 shadow-2xl w-full md:w-1/2 lg:w-1/3 border border-gray-200"
          >
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                
              </div>

            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Lifetime Access</h3>
                <p className="text-gray-600 text-sm">One-time payment, lifetime access to all features</p>
              </div>

            <div className="mb-6">
              <div className="flex items-end">
                  <span className="text-6xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-2 mb-2">one-time</span>
                </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "100,000 QR Codes Monthly for Life, Forever!",
                "4 Different Printable Templates",
                "Advanced Analytics System",
                "Domain Link Shown in QR Code Sticker",
                "Fully White Label",
                "Full Verification Page Customization",
                "QR Code Manager With Bulk Actions",
                "Reviews and Feedback System",
                "No Recurring Payments"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-900/90">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleClaim}
              disabled={isLoading}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 text-lg font-semibold py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? 'Processing...' : 'CLAIM LIFETIME DEAL'}
            </Button>
          
              <p className="text-center text-gray-600 text-sm mt-4">
              30-Day Money-Back Guarantee
            </p>
          </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="group border border-gray-200 rounded-xl p-6 bg-gray-50 transition-shadow hover:shadow-lg">
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 group-open:text-purple-600 transition-colors">
                What is included in the Qrified lifetime deal?
                <span className="ml-4 text-purple-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="mt-4 text-gray-700 text-base leading-relaxed">
                You get lifetime access to the entire Qrified platform, including 100,000 QR codes per month, advanced analytics, anti-counterfeiting, custom branding, and all future updates—no recurring fees, ever.
              </div>
            </details>
            {/* FAQ Item 2 */}
            <details className="group border border-gray-200 rounded-xl p-6 bg-gray-50 transition-shadow hover:shadow-lg">
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 group-open:text-purple-600 transition-colors">
                Can I upgrade or get more QR codes if I need them?
                <span className="ml-4 text-purple-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="mt-4 text-gray-700 text-base leading-relaxed">
                Yes! If you ever need more than 100,000 QR codes per month, just contact us and we'll work out a custom solution for your needs—no limits for growing brands.
              </div>
            </details>
            {/* FAQ Item 3 */}
            <details className="group border border-gray-200 rounded-xl p-6 bg-gray-50 transition-shadow hover:shadow-lg">
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 group-open:text-purple-600 transition-colors">
                Is there a money-back guarantee?
                <span className="ml-4 text-purple-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="mt-4 text-gray-700 text-base leading-relaxed">
                Absolutely! If you're not satisfied for any reason, just let us know within 30 days and you'll get a full refund—no questions asked.
              </div>
            </details>
            {/* FAQ Item 4 */}
            <details className="group border border-gray-200 rounded-xl p-6 bg-gray-50 transition-shadow hover:shadow-lg">
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 group-open:text-purple-600 transition-colors">
                Can I use Qrified for any type of product or business?
                <span className="ml-4 text-purple-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="mt-4 text-gray-700 text-base leading-relaxed">
                Yes! Qrified is perfect for e-commerce, luxury goods, supplements, collectibles, and any business that wants to protect products and build customer trust.
              </div>
            </details>
            {/* FAQ Item 5 */}
            <details className="group border border-gray-200 rounded-xl p-6 bg-gray-50 transition-shadow hover:shadow-lg">
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 group-open:text-purple-600 transition-colors">
                Will I get all future updates and features?
                <span className="ml-4 text-purple-500 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="mt-4 text-gray-700 text-base leading-relaxed">
                Yes! Lifetime deal customers get all future updates, improvements, and new features at no extra cost.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-900 py-12 relative border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-3 text-purple-600">QRIFIED</h3>
          <p className="text-md text-gray-700 mb-6 max-w-2xl mx-auto">
              The gold standard for product authenticity and anti-counterfeiting through secure, dynamic QR codes.
            </p>
            
            {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
              <a 
                href="https://instagram.com/qrified.app" 
                target="_blank" 
                rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110 transform"
              >
              <Instagram className="h-7 w-7" />
              </a>
              <a 
                href="https://tiktok.com/@qrified" 
                target="_blank" 
                rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110 transform"
              >
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-1.183-.11 6.44 6.44 0 106.44 6.44V8.206a8.238 8.238 0 004.976 1.686v-3.206z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/soufianehm/" 
                target="_blank" 
                rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110 transform"
              >
              <Linkedin className="h-7 w-7" />
              </a>
            </div>
            
          <div className="space-y-2 mb-6 text-sm">
            <p className="text-gray-700">Contact: contact@qrified.app</p>
            <div className="space-x-4">
              <span className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">Privacy</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">Terms</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">Cookie Policy</span>
            </div>
            </div>
            
          <p className="text-xs text-gray-500">
              © 2025 Qrified. All rights reserved. | London, England
            </p>
        </div>
      </footer>
    </div>
  );
};

export default LifetimePage; 
