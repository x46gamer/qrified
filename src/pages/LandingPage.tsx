
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
  ChevronUp,
  Globe
} from 'lucide-react';

// Arabic translations
const arabicTranslations = {
  heroTitle: "منتجاتك تستحق الأصالة.",
  heroSubtitle: "أوقف التزييف، ابني الثقة، واجمع ملاحظات حقيقية — فورًا.",
  heroDescription: "أطلق نظام المصادقة الخاص بك عبر رموز QR الذكية في دقائق. مصمم خصيصًا للتجار الجزائريين. مدعوم بتقنيات التشفير الحديثة والتحليلات وأدوات ملاحظات العملاء.",
  tryDemo: "جرب العرض التوضيحي",
  watchHow: "شاهد كيف يعمل",
  forSmart: "مصممة للبائعين الأذكياء الذين يريدون البقاء في المقدمة",
  ecommerce: "تجار التجارة الإلكترونية",
  localBrands: "العلامات التجارية المحلية",
  wholesale: "موزعين الجملة",
  dropshippers: "دروبشيبرز",
  steps: "3 خطوات بسيطة لتأمين منتجاتك",
  step1: "إنشاء رموز QR مشفرة",
  step2: "طباعة وإرفاق",
  step3: "مسح ضوئي والتحقق",
  customizeTemplate: "تخصيص القالب والكمية والعلامة التجارية",
  teamPrint: "يمكن لفريقك الطباعة بكميات كبيرة — بدون مهارات تقنية",
  customerScan: "يمسح العملاء للتحقق من المنتج وترك المراجعات",
  secureNote: "كل رمز QR يستخدم مرة واحدة، مشفر بـ AES، ويتم تتبعه بتحليلات كاملة.",
  allInOne: "منصة شاملة. مليئة بالميزات الذكية.",
  pricingTitle: "تسعير بسيط وشفاف لكل مرحلة",
  starterPlan: "المبتدئ",
  proPlan: "برو",
  lifetimeDeal: "صفقة مدى الحياة",
  perMonth: "شهريًا",
  oneTime: "مرة واحدة",
  merchantsLove: "التجار يحبونه بالفعل",
  techTitle: "مبني بأحدث التقنيات، حتى لا تضطر للقلق",
  encryption: "تشفير AES-256",
  oneTimeValidation: "التحقق لمرة واحدة",
  isolatedPermissions: "أذونات معزولة",
  mobileFriendly: "تصميم متوافق مع الجوال",
  finalCTA: "منتجاتك. تم التحقق منها، وحمايتها، وموثوقة.",
  startFree: "ابدأ مجانًا. الترقية في أي وقت. علامتك التجارية تستحق ذلك.",
  createAccount: "أنشئ حسابك المجاني",
  chatWhatsApp: "تحدث معنا على واتساب",
  buyLifetime: "اشتر الصفقة المؤبدة الآن",
  madeInAlgeria: "صنع في الجزائر بشغف"
};

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

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
    <div className={`min-h-screen bg-white overflow-x-hidden ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header - Now with auto-hide on scroll */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm py-3' : 'bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4'
      }`}>
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">seQRity</span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 rounded-full">BETA</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={toggleLanguage}
            >
              <Globe size={16} />
              {isArabic ? 'English' : 'العربية'}
            </Button>
            
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
              {isArabic ? arabicTranslations.heroTitle : "Your Products Deserve Authenticity."}
              <div className="absolute -top-4 -left-4 w-14 h-14 border-t-2 border-l-2 border-blue-400 opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 border-b-2 border-r-2 border-violet-400 opacity-60"></div>
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-on-scroll opacity-0">
            {isArabic ? arabicTranslations.heroSubtitle : "Stop Fakes, Build Trust, and Collect Real Feedback — Instantly."}
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-on-scroll opacity-0">
            {isArabic ? arabicTranslations.heroDescription : "Launch your smart QR code authentication system in minutes. Designed for Algerian merchants. Powered by modern encryption, analytics, and customer feedback tools."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-on-scroll opacity-0">
            <Button size="lg" asChild className="px-8 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-blue-500/25 transition-all">
              <Link to="/product-check">{isArabic ? arabicTranslations.tryDemo : "Try the Demo"}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 border-blue-500 text-blue-600 hover:bg-blue-50">
              <Link to="/login">{isArabic ? arabicTranslations.watchHow : "Watch How It Works"}</Link>
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
              <p className="text-gray-600 mt-4 font-medium">
                {isArabic ? "العميل يمسح رمز QR → التحقق → يترك تقييم" : "Customer scans QR code → Verification → Leaves review"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZjBmNGZhIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTM2IDE4YzIuMjA5IDAgNCAxLjc5MSA0IDRzLTEuNzkxIDQtNCA0LTQtMS43OTEtNC00IDEuNzkxLTQgNC00eiIgZmlsbD0iI2UwZTdmZiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            {isArabic ? arabicTranslations.forSmart : "Built for Smart Sellers Who Want to Stay Ahead"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShoppingCart size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? arabicTranslations.ecommerce : "E-commerce Merchants"}</h3>
              <p className="text-gray-600">Add authenticity & boost conversions</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-300 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Shield size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? "العلامات التجارية المحلية" : "Local Brands"}</h3>
              <p className="text-gray-600">Protect reputation from cheap copies</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-300 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? "موزعين الجملة" : "Wholesale Distributors"}</h3>
              <p className="text-gray-600">Manage large batches with ease</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-on-scroll opacity-0">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-300 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? "دروبشيبرز" : "Dropshippers"}</h3>
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
            {isArabic ? arabicTranslations.steps : "3 Simple Steps to Secure Your Products"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-blue-200"></div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? arabicTranslations.step1 : "Generate Encrypted QR Codes"}</h3>
              <p className="text-gray-600">{isArabic ? "تخصيص القالب والكمية والعلامة التجارية" : "Customize template, quantity, and branding"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? arabicTranslations.step2 : "Print & Attach"}</h3>
              <p className="text-gray-600">{isArabic ? "يمكن لفريقك الطباعة بكميات كبيرة — بدون مهارات تقنية" : "Your team can print in bulk — no tech skills needed"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{isArabic ? arabicTranslations.step3 : "Scan & Verify"}</h3>
              <p className="text-gray-600">{isArabic ? "يمسح العملاء للتحقق من المنتج وترك المراجعات" : "Customers scan to verify product and leave reviews"}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6 mt-10 text-center animate-on-scroll opacity-0">
            <p className="text-blue-800 font-medium">
              {isArabic ? arabicTranslations.secureNote : "Each QR code is one-time use, AES-encrypted, and tracked with full analytics."}
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-violet-50 px-4 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxIDAgMS43OTIuNjQgMi4xLjk0bDIuMjcgMi4yOGMuMy4zMS45NCAxLjA1Ljk0IDIuMDYgMCAyLjIxLTEuNzkgNC00IDQtMi4yMDkgMC00LTEuNzktNC00czEuNzkxLTQgNC00eiIgc3Ryb2tlPSIjZWRlZGZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBmaWxsPSIjZjVmNWZmIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
            {isArabic ? arabicTranslations.allInOne : "All-in-One Platform. Packed with Smart Features."}
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMTAgMjBhMiAyIDAgMSAwIDAtNCAxIDEgMCAwIDEgMC0yIDQgNCAwIDEgMSAwIDggNCA0IDAgMCAxIDAtOCIgZmlsbD0iI2YwZjRmYSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            {isArabic ? arabicTranslations.pricingTitle : "Simple, Transparent Pricing for Every Stage"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative animate-on-scroll opacity-0 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 bg-blue-100 px-3 py-1 text-blue-600 text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Starter
              </div>
              <h3 className="text-2xl font-bold mb-2">{isArabic ? arabicTranslations.starterPlan : "Starter"}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">1,200</span>
                <span className="text-gray-500 mb-1">DZD/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>100 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Employee panel</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Lock className="shrink-0 mt-0.5" size={18} />
                  <span>Full analytics</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Lock className="shrink-0 mt-0.5" size={18} />
                  <span>Customer reviews</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Start Free Trial</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-xl border-2 border-blue-200 relative animate-on-scroll opacity-0 transform scale-105 transition-all hover:-translate-y-1 hover:shadow-2xl z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Most Popular
              </div>
              <div className="absolute top-0 right-0 bg-blue-500 px-3 py-1 text-white text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Pro
              </div>
              <h3 className="text-2xl font-bold mb-2">{isArabic ? arabicTranslations.proPlan : "Pro"}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">2,500</span>
                <span className="text-gray-500 mb-1">DZD/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>500 QR codes/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>All templates & custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Full analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Customer reviews & ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-blue-500/25">
                <Link to="/login">Choose Pro</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-white to-violet-50 p-8 rounded-xl shadow-lg border border-violet-200 relative animate-on-scroll opacity-0 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 bg-violet-500 px-3 py-1 text-white text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Lifetime
              </div>
              <h3 className="text-2xl font-bold mb-2">{isArabic ? arabicTranslations.lifetimeDeal : "Lifetime Deal"}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">25,000</span>
                <span className="text-gray-500 mb-1">DZD</span>
              </div>
              <div className="bg-violet-100 text-violet-800 text-xs font-bold uppercase px-2 py-1 rounded mb-6 inline-block">
                {isArabic ? arabicTranslations.oneTime : "One-time payment"}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Unlimited QR codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>All Pro features included</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Free updates for life</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-violet-300 text-violet-600 hover:bg-violet-50">
                <Link to="/login">Buy Lifetime Access</Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-center animate-on-scroll opacity-0">
            <p className="text-gray-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-violet-50 opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-200 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll opacity-0 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block">
            {isArabic ? arabicTranslations.finalCTA : "Your Products. Verified, Protected, and Trusted."}
          </h2>
          <p className="text-lg text-gray-600 mb-10 animate-on-scroll opacity-0">
            {isArabic ? arabicTranslations.startFree : "Start free. Upgrade anytime. Your brand is worth it."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-blue-500/25">
              <Link to="/signup">{isArabic ? arabicTranslations.createAccount : "Create Your Free Account"}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-blue-300">
              <a href="https://wa.me/+213555555555" target="_blank">{isArabic ? arabicTranslations.chatWhatsApp : "Chat With Us on WhatsApp"}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">seQRity</h3>
              <p className="text-gray-600 text-sm mb-4">
                Protect your products with smart QR authentication.
                <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 rounded-full">BETA</span>
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 seQRity Inc.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/faq" className="hover:text-blue-600">FAQ</Link></li>
                <li><Link to="/support" className="hover:text-blue-600">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/terms-of-service" className="hover:text-blue-600">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-blue-600">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm">{isArabic ? arabicTranslations.madeInAlgeria : "Made in Algeria with passion"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
