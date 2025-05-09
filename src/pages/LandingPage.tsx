
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { 
  CheckCircle, 
  Star, 
  ShoppingCart, 
  Users, 
  Shield, 
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Lock,
  ChevronUp,
  Globe,
  ArrowRight,
  Play
} from 'lucide-react';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.2)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Arabic translations
const arabicTranslations = {
  heroTitle: "منتجاتك تستحق الأصالة.",
  heroSubtitle: "أوقف التزييف، ابني الثقة، واجمع ملاحظات حقيقية — فورًا.",
  heroDescription: "أطلق نظام المصادقة الخاص بك عبر رموز QR الذكية في دقائق. مصمم خصيصًا للتجار الجزائريين. مدعوم بتقنيات التشفير الحديثة والتحليلات وأدوات ملاحظات العملاء.",
  // ...rest of translations
};

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [isPriceYearly, setIsPriceYearly] = useState(false);
  
  // Refs for sections to track visibility
  const heroRef = useRef<HTMLDivElement>(null);
  const forRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  
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
    
    // Check if elements are in viewport for animation triggers
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-100px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);
    
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      elements.forEach(el => observer.unobserve(el));
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
  
  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    // If we're switching to Arabic, add RTL class to body
    if (!isArabic) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50 ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header - with glassmorphism effect */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-2 bg-white/80 backdrop-blur-xl shadow-lg' : 'py-4 bg-white/60 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="https://xowxgbovrbnpsreqgrlt.supabase.co/storage/v1/object/public/content//1fbd5402-f9f9-49b4-90f0-38d70c7dd216.png"
              alt="SeQRity Logo"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-700 rounded-full font-medium">BETA</span>
          </Link>
          
          <div className="flex items-center gap-3 md:gap-5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700" 
              onClick={toggleLanguage}
            >
              <Globe size={16} />
              {isArabic ? 'English' : 'العربية'}
            </Button>
            
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all border-0">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                    <Link to="/login">Login</Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all border-0">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Scroll to top button */}
      <motion.button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-white shadow-lg z-50 border border-blue-100 transition-all duration-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp size={24} />
      </motion.button>

      {/* Hero Section - Enhanced with glassmorphism and animations */}
      <section ref={heroRef} className="pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 opacity-70"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto text-center max-w-4xl relative z-10"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative"
          >
            <span className="bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent inline-block relative">
              Your Product. 
              <br className="hidden sm:block" />
              Verified. Trusted. Future-Proof.
            </span>
          </motion.h1>
          
          <motion.h2 
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto"
          >
            Stop counterfeits, gain customer trust, and collect real-time reviews — instantly.
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto"
          >
            Built for Algerian sellers. Powered by encrypted QR codes and smart analytics.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" asChild className="px-8 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all border-0 rounded-full">
                <Link to="/check" className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  Try Live Demo
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="px-8 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-full">
                <Link to="#" className="flex items-center gap-2">
                  <Play size={18} />
                  Watch How It Works
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Animated QR Flow Demonstration */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-blue-200/30 max-w-3xl mx-auto border border-blue-100/50 hover:shadow-2xl hover:shadow-blue-300/30 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent rounded-2xl blur-md"></div>
              
              {/* QR Code */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg relative z-10"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-4xl">📱</div>
                </div>
              </motion.div>
              
              {/* Arrow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-3xl text-blue-600"
              >
                <ArrowRight className="h-8 w-8" />
              </motion.div>
              
              {/* Phone */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center">
                  <div className="text-2xl">🔍</div>
                </div>
              </motion.div>
              
              {/* Arrow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="text-3xl text-blue-600"
              >
                <ArrowRight className="h-8 w-8" />
              </motion.div>
              
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
              >
                <CheckCircle size={48} className="text-green-600 animate-pulse" />
              </motion.div>
              
              {/* Arrow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-3xl text-blue-600"
              >
                <ArrowRight className="h-8 w-8" />
              </motion.div>
              
              {/* Reviews */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
              >
                <Star size={48} className="text-amber-500" />
              </motion.div>
            </div>
            <p className="text-slate-600 mt-6 font-medium">
              Customer scans QR code → Verification → Leaves review
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Who It's For */}
      <section ref={forRef} className="py-20 px-4 relative overflow-hidden reveal-on-scroll">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50 opacity-70"></div>
        <div className="absolute -top-60 -left-60 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto text-center max-w-6xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            Built for Smart Sellers Who Want to Stay Ahead
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShoppingCart size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">E-commerce Merchants</h3>
              <p className="text-slate-600">Add authenticity & boost conversions with verified products.</p>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-300 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Shield size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Local Brands</h3>
              <p className="text-slate-600">Protect your reputation from counterfeit products and copycats.</p>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-300 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Users size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Wholesale Distributors</h3>
              <p className="text-slate-600">Manage large batches of products with simplified tracking.</p>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-300 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <TrendingUp size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Dropshippers</h3>
              <p className="text-slate-600">Add a professional touch to products and build customer trust.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section ref={howRef} className="py-20 px-4 relative overflow-hidden reveal-on-scroll">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-transparent"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto max-w-6xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            3 Simple Steps to Secure Your Products
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-24 left-[25%] right-[25%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-300 to-blue-200"></div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 relative"
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">1</div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Generate QR Codes</h3>
              <p className="text-slate-600">Customize template, quantity, and branding to match your product identity.</p>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 relative md:mt-10"
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">2</div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Print & Attach</h3>
              <p className="text-slate-600">Your team can print in bulk — no technical skills needed.</p>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 relative"
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">3</div>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Scan & Verify</h3>
              <p className="text-slate-600">Customers scan to verify authenticity and leave reviews instantly.</p>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 mt-12 text-center"
          >
            <p className="text-blue-800 font-medium">
              Each QR code is AES-encrypted, one-time use, and tracked with full analytics.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-br from-slate-50 to-violet-50 px-4 relative reveal-on-scroll">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxIDAgMS43OTIuNjQgMi4xLjk0bDIuMjcgMi4yOGMuMy4zMS45NCAxLjA1Ljk0IDIuMDYgMCAyLjIxLTEuNzkgNC00IDQtMi4yMDkgMC00LTEuNzktNC00czEuNzkxLTQgNC00eiIgc3Ryb2tlPSIjZWRlZGZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBmaWxsPSIjZjVmNWZmIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto max-w-6xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            One Platform. All the Tools You Need.
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <FileText size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">QR Code Generator</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Create 1–100 codes at once</li>
                <li>Auto-numbering & encrypted IDs</li>
                <li>4 ready-to-use design templates with RTL Arabic layout</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Settings size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Admin Panel</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Track scans, reviews & feedback</li>
                <li>Enable/disable codes</li>
                <li>Customize success/failure pages</li>
                <li>Export reports in multiple formats</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Users size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Employee Panel</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Limited access permissions</li>
                <li>QR printing only</li>
                <li>Safe for team collaboration</li>
                <li>Activity tracking for all team members</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Customer Reviews</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Collect authentic feedback</li>
                <li>Star rating system</li>
                <li>Photo & video reviews</li>
                <li>Moderation tools</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <CreditCard size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Payment Options</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Local payment methods</li>
                <li>CIB/EDAHABIA support</li>
                <li>Cash on delivery integration</li>
                <li>Monthly subscription billing</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Lock size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Security Features</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Military-grade encryption</li>
                <li>Tamper-evident QR codes</li>
                <li>Detailed security logs</li>
                <li>User permission management</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
