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
              src="https://files08.oaiusercontent.com/file-CeRPb526gbX59JCdmrAJuf?se=2025-05-09T19%3A19%3A47Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1fbd5402-f9f9-49b4-90f0-38d70c7dd216.png"
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
              <h3 className="font-bold text-xl mb-3 text-slate-800">Feedback System</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Star ratings (1–5)</li>
                <li>Comments + photo uploads</li>
                <li>Linked directly to individual QR codes</li>
                <li>Collect valuable customer insights</li>
              </ul>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <TrendingUp size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Analytics Dashboard</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Scan rate trends and insights</li>
                <li>Feedback analysis and sentiment</li>
                <li>Interactive charts and visualizations</li>
                <li>Comprehensive activity logging</li>
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
              <h3 className="font-bold text-xl mb-3 text-slate-800">Custom Branding</h3>
              <ul className="text-slate-600 list-disc pl-5 space-y-2">
                <li>Add your logo and brand colors</li>
                <li>Personalize verification success screens</li>
                <li>Control messaging for all user touchpoints</li>
                <li>Create a seamless brand experience</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Localized for Algeria */}
      <section className="py-20 px-4 relative overflow-hidden reveal-on-scroll">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-50 to-transparent"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto max-w-4xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            Made for Algerian Merchants
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <p className="font-medium">Arabic (RTL) Support</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <CreditCard size={24} />
              </div>
              <p className="font-medium">Dinar-Based Pricing</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <CreditCard size={24} />
              </div>
              <p className="font-medium">BaridiMob / CCP Payment</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <p className="font-medium">Local Hosting & Privacy</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Settings size={24} />
              </div>
              <p className="font-medium">No Tech Skills Needed</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 px-4 relative reveal-on-scroll">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMTAgMjBhMiAyIDAgMSAwIDAtNCAxIDEgMCAwIDEgMC0yIDQgNCAwIDEgMSAwIDggNCA0IDAgMCAxIDAtOCIgZmlsbD0iI2YwZjRmYSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto max-w-6xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            Simple, Transparent Pricing for Every Stage
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-full p-1 shadow-md inline-flex">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isPriceYearly ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md' : 'text-slate-600'}`}
                onClick={() => setIsPriceYearly(false)}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isPriceYearly ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md' : 'text-slate-600'}`}
                onClick={() => setIsPriceYearly(true)}
              >
                Lifetime
              </button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 relative"
            >
              <div className="absolute top-0 right-0 bg-blue-100 px-3 py-1 text-blue-600 text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Starter
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">Starter</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-800">1,200</span>
                <span className="text-slate-500 mb-1">DZD/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">100 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Basic templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Employee panel</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <Lock className="shrink-0 mt-0.5" size={18} />
                  <span>Full analytics</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <Lock className="shrink-0 mt-0.5" size={18} />
                  <span>Customer reviews</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border-2 border-blue-200 relative transform scale-105 z-10"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Most Popular
              </div>
              <div className="absolute top-0 right-0 bg-blue-500 px-3 py-1 text-white text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Pro
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">Pro</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-800">2,500</span>
                <span className="text-slate-500 mb-1">DZD/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">500 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">All templates & custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Full analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Customer reviews & ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Priority support</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-blue-500/25 rounded-xl border-0">
                <Link to="/signup">Choose Pro</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-white to-violet-50 p-8 rounded-2xl shadow-lg border border-violet-200 relative"
            >
              <div className="absolute top-0 right-0 bg-violet-500 px-3 py-1 text-white text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Lifetime
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">Lifetime Deal</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-800">25,000</span>
                <span className="text-slate-500 mb-1">DZD</span>
              </div>
              <div className="bg-violet-100 text-violet-800 text-xs font-bold uppercase px-2 py-1 rounded mb-6 inline-block">
                One-time payment
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Unlimited QR codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">All Pro features included</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Free updates for life</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700">Dedicated account manager</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-violet-300 text-violet-600 hover:bg-violet-50 rounded-xl">
                <Link to="/signup">Buy Lifetime Access</Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-slate-500">All plans include a 14-day free trial. No credit card required.</p>
            <p className="text-violet-600 font-medium mt-2">🔥 This month only: Get lifetime for 25,000 DZD!</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 relative overflow-hidden reveal-on-scroll">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto max-w-5xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            Merchants Already Trust SeQRity
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">
                "We've seen a 35% increase in customer trust since implementing seQRity. Our customers love scanning to verify before purchase."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center font-medium">
                  AM
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Ahmed M.</p>
                  <p className="text-sm text-slate-500">Electronics Store Owner</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">
                "Finally, a solution that's actually built for our market. The Arabic support and local payment options made this an easy choice."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full text-purple-600 flex items-center justify-center font-medium">
                  LB
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Leila B.</p>
                  <p className="text-sm text-slate-500">Fashion Brand Founder</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">
                "The customer reviews feature is a game-changer. We're getting valuable feedback directly tied to each product batch."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full text-green-600 flex items-center justify-center font-medium">
                  SK
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Said K.</p>
                  <p className="text-sm text-slate-500">Wholesale Distributor</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <span className="bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-full">
              120+ brands protected across Algeria
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative overflow-hidden reveal-on-scroll">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-violet-50 opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-200 rounded-full filter blur-3xl opacity-30"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto text-center max-w-3xl relative z-10"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
          >
            Your Products. Verified. Protected. Trusted.
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-slate-600 mb-10"
          >
            Start free. Upgrade anytime. Your brand is worth it.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-blue-500/25 rounded-xl border-0">
                <Link to="/signup">Create Your Free Account</Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl">
                <a href="https://wa.me/+213555555555" target="_blank" rel="noopener noreferrer">Chat With Us on WhatsApp</a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4 reveal-on-scroll">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">
                <img
                  src="https://files08.oaiusercontent.com/file-CeRPb526gbX59JCdmrAJuf?se=2025-05-09T19%3A19%3A47Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1fbd5402-f9f9-49b4-90f0-38d70c7dd216.png"
                  alt="SeQRity Logo"
                  className="h-6 w-auto"
                />
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Protect your products with smart QR authentication.
                <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 rounded-full">BETA</span>
              </p>
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} seQRity Inc.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-800">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-800">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
                <li><Link to="/support" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-800">Legal</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-blue-600 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
              Made in Algeria with passion
              <span className="ml-1 text-lg">🇩🇿</span>
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <a href="https://instagram.com/seqritydz" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600">
                Instagram
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
