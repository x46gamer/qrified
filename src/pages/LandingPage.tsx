import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, easeInOut } from 'framer-motion';
import { QrCode, Menu, X, Shield, Lock, Key, Eye, Zap, CheckCircle, Activity, MapPin, BarChart, AlertTriangle, Fingerprint, Check, XCircle } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Placeholder components to satisfy imports from the landing.tsx code
const LoadingScreen = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
const QrCodeAnimation = () => <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc' }}>QR Code Animation Placeholder</div>;
const SectionTitle = ({ title, subtitle, description }: { title: string; subtitle?: string; description?: string }) => (
  <div style={{ textAlign: 'center', margin: '40px 0' }}>
    {subtitle && <h3 style={{ color: '#6366F1' }}>{subtitle}</h3>}
    <h1 style={{ fontSize: '2em', fontWeight: 'bold' }}>{title}</h1>
    {description && <p style={{ color: '#6B7280' }}>{description}</p>}
  </div>
);
const ParallaxLayer = ({ children, speed, direction, className }: { children: React.ReactNode; speed?: number; direction?: 'left' | 'right'; className?: string }) => <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>{children}</div>;
const Feature = ({ icon: Icon, title, description, delay }: { icon: React.ElementType; title: string; description: string; delay?: number }) => (
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
    {Icon && <Icon size={32} style={{ color: '#6366F1', marginBottom: '10px' }} />}
    <h3 style={{ fontSize: '1.2em', fontWeight: 'semibold', marginBottom: '5px' }}>{title}</h3>
    <p style={{ color: '#6B7280' }}>{description}</p>
  </div>
);
// Simple Button placeholder - assuming it takes children and renders a button or anchor
const Button = ({ children, href, onClick, variant = 'primary', size = 'default', className = '', ...props }: any) => {
  const baseStyle = "font-semibold rounded-lg transition duration-300 transform focus:outline-none";
  let variantStyle = "";
  let sizeStyle = "";

  if (variant === 'primary') {
    variantStyle = "button-primary text-white shadow-md hover:shadow-lg hover:scale-105";
  } else if (variant === 'secondary') {
    variantStyle = "button-secondary border-2 shadow-lg hover:scale-105";
  } else if (variant === 'ghost') {
    variantStyle = "hover:bg-gray-100 dark:hover:bg-gray-800"; // Example
  }

  if (size === 'default') {
    sizeStyle = "py-2.5 px-6 text-sm";
    if (variant === 'primary') sizeStyle = "py-3 px-8 text-md";
  } else if (size === 'sm') {
    sizeStyle = "py-2 px-5 text-sm";
  } else if (size === 'lg') {
    sizeStyle = "py-4 px-10 text-lg";
  } else if (size === 'icon') {
    sizeStyle = "p-2";
  }
  
  // Special case for Get Started Free button in header
  if (props['data-translation-key'] === "navGetStarted") {
    return (
      <a href="#" className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Translations Object (condensed for brevity, ensure all keys are present as in original HTML)
const translations = {
    en: {
        brandName: "QRified", betaBadge: "BETA", navFeatures: "Features", navPerks: "Perks", navBlog: "Blog", navPricing: "Pricing", navDocs: "Docs", navLogin: "Login", navGetStarted: "Get Started Free",
        navFeaturesMobile: "Features", navPerksMobile: "Perks", navBlogMobile: "Blog", navPricingMobile: "Pricing", navDocsMobile: "Docs", navLoginMobile: "Login",
        heroTitle: "The <span class='hero-gradient-text'>Next Evolution</span> in Secure Product Authentication.",
        heroSubtitle: "QRified delivers unparalleled security and builds customer trust with advanced, encrypted QR code technology. Verify authenticity, collect feedback, and unlock powerful insights.",
        heroCtaPrimary: "Start Authenticating", heroCtaSecondary: "Explore Features", heroImagePlaceholder: "Hero Image/Dashboard Mockup Placeholder",
        asFeaturedInTitle: "As Featured In", 
        trustedByTitle: "Powering Security for Innovative Brands",
        feature1TitleLead: "Seamless", feature1TitleAccent: "QR Creation & Control", feature1Desc: "Effortlessly generate, customize, and manage secure QR codes at scale. Our intuitive platform puts you in complete command of your product authentication strategy from start to finish.",
        feature1Item1: "Bulk generate unique, encrypted QR codes with advanced templating.", feature1Item2: "Centralized dashboard for real-time monitoring and status updates.", feature1Item3: "Enable/disable codes, reset scan status, and manage lifecycle with ease.", feature1Item4: "Full RTL support and customizable text fields for global branding.", feature1Cta: "Discover QR Tools", feature1ImagePlaceholder: "Placeholder: UI of QR Generation & Management Dashboard",
        feature2TitleLead: "Ironclad", feature2TitleAccent: "Verification & Engagement", feature2Desc: "Provide customers with instant, reliable product authentication while opening a direct channel for valuable feedback. Build trust and gather insights simultaneously.",
        feature2Item1: "One-time use scan validation to prevent counterfeiting and ensure authenticity.", feature2Item2: "Customizable success/failure pages for a branded verification experience.", feature2Item3: "Integrated system for collecting product reviews, ratings, and photo uploads.", feature2Item4: "Gather targeted improvement suggestions linked directly to scanned products.", feature2Cta: "See Verification Power", feature2ImagePlaceholder: "Placeholder: Phone scanning QR & showing verification + feedback form",
        feature3TitleLead: "Actionable", feature3TitleAccent: "Insights & Customization", feature3Desc: "Leverage powerful analytics to understand customer behavior and product performance. Tailor the platform to your brand for a seamless, secure, and scalable solution.",
        feature3Item1: "Comprehensive analytics dashboard: scan rates, review metrics, activity logs.", feature3Item2: "Deep customization: themes, logos, verification pages, feature toggles.", feature3Item3: "Robust Supabase infrastructure ensuring data security and scalability.", feature3Item4: "AES encryption and efficient data handling for peace of mind.", feature3Cta: "Explore Analytics & Settings", feature3ImagePlaceholder: "Placeholder: Analytics dashboard mockup & customization UI",
        toolsTitleLead: "Supercharge Your", toolsTitleAccent: "Authentication Strategy", toolsSubtitle: "QRified provides a suite of powerful tools designed to give you maximum control and insight.",
        tool1Title: "Batch Operations", tool1Desc: "Generate, update, or manage thousands of QR codes simultaneously with powerful batch processing capabilities.",
        tool2Title: "Template System", tool2Desc: "Choose from diverse pre-built templates or create your own to ensure QR codes align perfectly with your branding.",
        tool3Title: "Advanced Filtering", tool3Desc: "Easily locate specific QR codes or analyze segments of your data with robust search and filtering options.",
        tool4Title: "Global Support (RTL)", tool4Desc: "Full Right-to-Left language support ensures your authentication experience is seamless for all users worldwide.",
        tool5Title: "Data Encryption", tool5Desc: "AES encryption for QR data and unique identifiers ensures your product information and authentication process are secure.",
        tool6Title: "One-Time Scan Logic", tool6Desc: "Prevent QR code misuse and ensure true authenticity with our robust one-time scan validation system.",
        perksTitleLead: "The", perksTitleAccent: "QRified Advantage", perksSubtitle: "Discover the unique benefits that make QRified the leading choice for product authentication.",
        perk1Title: "Unbreakable Security", perk1Desc: "Protect your brand with cutting-edge encryption and anti-counterfeit measures.",
        perk2Title: "Mobile First Access", perk2Desc: "Customers verify products instantly using any smartphone, anywhere, anytime.",
        perk3Title: "Save Time & Money", perk3Desc: "Streamline authentication, reduce counterfeit losses, and gain operational efficiencies.",
        perk4Title: "Extensive Insights", perk4Desc: "Leverage rich analytics on scans and feedback to understand your market better.",
        perk5Title: "Boost Customer Trust", perk5Desc: "Demonstrate commitment to authenticity and transparency, enhancing brand loyalty.",
        perk6Title: "Easy Integration", perk6Desc: "Seamlessly integrate with your existing systems and workflows (API details coming soon).",
        blogTitleLead: "From the", blogTitleAccent: "QRified Blog", blogViewAllCta: "View All Articles",
        blog1Category: "Security", blog1Title: "The Future of Anti-Counterfeiting with QR Codes", blog1Excerpt: "Learn how advanced QR code technology is revolutionizing brand protection and supply chain integrity...", blog1Meta: "By Alex Chen • May 28, 2025 • 5 min read",
        blog2Category: "Customer Engagement", blog2Title: "Beyond Verification: Using QR Codes to Build Customer Loyalty", blog2Excerpt: "Discover innovative ways to leverage QR code interactions for feedback, exclusive content, and enhanced...", blog2Meta: "By Sarah Miller • May 22, 2025 • 7 min read",
        blog3Category: "Tech Insights", blog3Title: "Understanding AES Encryption in QRified's Secure System", blog3Excerpt: "A deep dive into the cryptographic methods that keep your product data safe and secure with QRified...", blog3Meta: "By Dr. Emily Carter • May 15, 2025 • 8 min read",
        pricingTitleLead: "Transparent", pricingTitleAccent: "Pricing", pricingTitleEnd: "for Every Scale", pricingSubtitle: "Choose a plan that aligns with your business needs. Simple, scalable, and powerful.", planPerMonth: "/mo",
        plan1Name: "Starter", plan1Desc: "Ideal for small businesses & startups.", plan1Feat1: "Up to 1,000 QR codes", plan1Feat2: "Basic Analytics Dashboard", plan1Feat3: "Standard QR Templates", plan1Feat4: "Email Support", plan1Cta: "Choose Starter",
        planPopularBadge: "Most Popular", plan2Name: "Pro", plan2Desc: "For growing businesses needing more power.", plan2Feat1: "Up to 10,000 QR codes", plan2Feat2: "Advanced Analytics & Reporting", plan2Feat3: "All Templates + Customization", plan2Feat4: "Feedback & Review System", plan2Feat5: "Priority Email & Chat Support", plan2Cta: "Choose Pro",
        plan3Name: "Enterprise", plan3Price: "Custom", plan3Desc: "Tailored solutions for large-scale needs.", plan3Feat1: "Unlimited QR codes", plan3Feat2: "Full API Access & Integrations", plan3Feat3: "Dedicated Account Manager", plan3Feat4: "Custom SLA & Premium Support", plan3Cta: "Contact Sales",
        ctaTitle: "Elevate Your Brand's Security with <span class='hero-gradient-text'>QRified</span>.", ctaSubtitle: "Step into the future of product authentication. Protect your brand, engage customers, and unlock growth.", ctaButton: "Request a Demo",
        footerBrandName: "QRified", footerTagline: "The Future of Secure Authentication.", footerCompanyName: "QRified Technologies Ltd (15374908)", footerAddr1: "275 New N Rd, London, N1 7AA", footerCountry: "United Kingdom",
        footerProductColTitle: "Product", footerProductLink1: "Core Features", footerProductLink2: "Tool Suite", footerProductLink3: "Pricing", footerProductLink4: "Security", footerProductLink5: "Integrations", footerProductLink6: "API (Coming Soon)",
        footerCompanyColTitle: "Company", footerCompanyLink1: "About Us", footerCompanyLink2: "Blog", footerCompanyLink3: "Careers", footerCompanyLink4: "Contact Us", footerCompanyLink5: "Partners",
        footerResourcesColTitle: "Resources", footerResourcesLink1: "Documentation", footerResourcesLink2: "Support Center", footerResourcesLink3: "FAQs", footerResourcesLink4: "Case Studies", footerResourcesLink5: "Community Forum",
        footerCopyright: "QRified Technologies Ltd. All Rights Reserved.", footerPrivacy: "Privacy Policy", footerTerms: "Terms and Conditions", footerCookies: "Cookie Policy",
    },
    ar: { 
        brandName: "QRified", betaBadge: "تجريبي", navFeatures: "الميزات", navPerks: "المزايا", navBlog: "المدونة", navPricing: "الأسعار", navDocs: "المستندات", navLogin: "تسجيل الدخول", navGetStarted: "ابدأ مجانًا",
        navFeaturesMobile: "الميزات", navPerksMobile: "المزايا", navBlogMobile: "المدونة", navPricingMobile: "الأسعار", navDocsMobile: "المستندات", navLoginMobile: "تسجيل الدخول",
        heroTitle: "<span class='hero-gradient-text'>التطور القادم</span> في المصادقة الآمنة للمنتجات.",
        heroSubtitle: "تقدم QRified أمانًا لا مثيل له وتبني ثقة العملاء بتقنية QR code المتقدمة والمشفرة. تحقق من الأصالة، واجمع الآراء، واكتشف رؤى قوية.",
        heroCtaPrimary: "ابدأ المصادقة", heroCtaSecondary: "اكتشف الميزات", heroImagePlaceholder: "[صورة البطل/نموذج لوحة التحكم]",
        asFeaturedInTitle: "كما ظهر في", 
        trustedByTitle: "دعم الأمان للعلامات التجارية المبتكرة",
        feature1TitleLead: "إنشاء وتحكم", feature1TitleAccent: "سلس برموز QR", feature1Desc: "أنشئ وخصص وأدر رموز QR code الآمنة بسهولة وعلى نطاق واسع. تمنحك منصتنا البديهية تحكمًا كاملاً في استراتيجية مصادقة منتجك من البداية إلى النهاية.",
        feature1Item1: "إنشاء جماعي لرموز QR code فريدة ومشفرة مع قوالب متقدمة.", feature1Item2: "لوحة تحكم مركزية للمراقبة في الوقت الفعلي وتحديثات الحالة.", feature1Item3: "تمكين/تعطيل الرموز، وإعادة تعيين حالة المسح، وإدارة دورة الحياة بسهولة.", feature1Item4: "دعم كامل للغات من اليمين إلى اليسار (RTL) وحقول نصية قابلة للتخصيص للعلامات التجارية العالمية.", feature1Cta: "اكتشف أدوات QR", feature1ImagePlaceholder: "[صورة واجهة مستخدم لإنشاء وإدارة رموز QR]",
        feature2TitleLead: "تحقق ومشاركة", feature2TitleAccent: "قويان", feature2Desc: "زوّد العملاء بمصادقة منتجات فورية وموثوقة مع فتح قناة مباشرة لآراء قيمة. ابنِ الثقة واجمع الرؤى في آن واحد.",
        feature2Item1: "التحقق من صحة المسح لمرة واحدة لمنع التزييف وضمان الأصالة.", feature2Item2: "صفحات نجاح/فشل قابلة للتخصيص لتجربة تحقق تحمل علامتك التجارية.", feature2Item3: "نظام متكامل لجمع تقييمات المنتجات والتعليقات وتحميلات الصور.", feature2Item4: "اجمع اقتراحات التحسين المستهدفة المرتبطة مباشرة بالمنتجات الممسوحة ضوئيًا.", feature2Cta: "شاهد قوة التحقق", feature2ImagePlaceholder: "[هاتف يمسح QR code ويظهر شاشة التحقق + نموذج الآراء]",
        feature3TitleLead: "رؤى قابلة للتنفيذ", feature3TitleAccent: "وتخصيص", feature3Desc: "استفد من التحليلات القوية لفهم سلوك العملاء وأداء المنتج. خصص المنصة لعلامتك التجارية للحصول على حل سلس وآمن وقابل للتطوير.",
        feature3Item1: "لوحة تحكم تحليلات شاملة: معدلات المسح، مقاييس التقييم، سجلات النشاط.", feature3Item2: "تخصيص عميق: السمات، الشعارات، صفحات التحقق، مفاتيح تبديل الميزات.", feature3Item3: "بنية تحتية قوية من Supabase تضمن أمان البيانات وقابلية التوسع.", feature3Item4: "تشفير AES ومعالجة فعالة للبيانات لراحة البال.", feature3Cta: "اكتشف التحليلات والإعدادات", feature3ImagePlaceholder: "[نموذج لوحة تحكم التحليلات وواجهة مستخدم التخصيص]",
        toolsTitleLead: "عزز استراتيجيتك", toolsTitleAccent: "في المصادقة", toolsSubtitle: "توفر QRified مجموعة من الأدوات القوية المصممة لمنحك أقصى قدر من التحكم والبصيرة.",
        tool1Title: "عمليات مجمعة", tool1Desc: "أنشئ أو حدّث أو أدر آلاف رموز QR code في وقت واحد بقدرات معالجة مجمعة قوية.",
        tool2Title: "نظام القوالب", tool2Desc: "اختر من بين مجموعة متنوعة من القوالب المعدة مسبقًا أو أنشئ قوالبك الخاصة لضمان توافق رموز QR code تمامًا مع علامتك التجارية.",
        tool3Title: "تصفية متقدمة", tool3Desc: "حدد مواقع رموز QR code معينة بسهولة أو حلل شرائح من بياناتك بخيارات بحث وتصفية قوية.",
        tool4Title: "دعم عالمي (RTL)", tool4Desc: "يضمن دعم اللغة الكامل من اليمين إلى اليسار تجربة مصادقة سلسة لجميع المستخدمين في جميع أنحاء العالم.",
        tool5Title: "تشفير البيانات", tool5Desc: "يضمن تشفير AES لبيانات QR code والمعرفات الفريدة أمان معلومات منتجك وعملية المصادقة.",
        tool6Title: "منطق المسح لمرة واحدة", tool6Desc: "امنع إساءة استخدام QR code وتأكد من الأصالة الحقيقية من خلال نظام التحقق القوي للمسح لمرة واحدة.",
        perksTitleLead: "ميزة", perksTitleAccent: "QRified", perksSubtitle: "اكتشف المزايا الفريدة التي تجعل QRified الخيار الرائد لمصادقة المنتجات.",
        perk1Title: "أمان لا يُكسر", perk1Desc: "احمِ علامتك التجارية بأحدث إجراءات التشفير ومكافحة التزييف.",
        perk2Title: "وصول عبر الهاتف أولاً", perk2Desc: "يتحقق العملاء من المنتجات فورًا باستخدام أي هاتف ذكي، في أي مكان وفي أي وقت.",
        perk3Title: "وفر الوقت والمال", perk3Desc: "بسّط عملية المصادقة، وقلل خسائر التزييف، وحقق كفاءات تشغيلية.",
        perk4Title: "رؤى شاملة", perk4Desc: "استفد من التحليلات الغنية حول عمليات المسح والآراء لفهم سوقك بشكل أفضل.",
        perk5Title: "عزز ثقة العملاء", perk5Desc: "أظهر الالتزام بالأصالة والشفافية، مما يعزز ولاء العلامة التجارية.",
        perk6Title: "تكامل سهل", perk6Desc: "تكامل بسلاسة مع أنظمتك الحالية وسير عملك (تفاصيل API قريبًا).",
        blogTitleLead: "من مدونة", blogTitleAccent: "QRified", blogViewAllCta: "عرض كل المقالات",
        blog1Category: "الأمان", blog1Title: "مستقبل مكافحة التزييف باستخدام رموز QR code", blog1Excerpt: "تعرف على كيف تُحدث تقنية QR code المتقدمة ثورة في حماية العلامة التجارية وسلامة سلسلة التوريد...", blog1Meta: "بقلم أليكس تشين • ٢٨ مايو ٢٠٢٥ • ٥ دقائق قراءة",
        blog2Category: "مشاركة العملاء", blog2Title: "ما بعد التحقق: استخدام رموز QR code لبناء ولاء العملاء", blog2Excerpt: "اكتشف طرقًا مبتكرة للاستفادة من تفاعلات QR code للحصول على الآراء والمحتوى الحصري وتعزيز...", blog2Meta: "بقلم سارة ميلر • ٢٢ مايو ٢٠٢٥ • ٧ دقائق قراءة",
        blog3Category: "رؤى تقنية", blog3Title: "فهم تشفير AES في نظام QRified الآمن", blog3Excerpt: "نظرة عميقة على الأساليب التشفيرية التي تحافظ على أمان بيانات منتجك مع QRified...", blog3Meta: "بقلم د. إميلي كارتر • ١٥ مايو ٢٠٢٥ • ٨ دقائق قراءة",
        pricingTitleLead: "أسعار", pricingTitleAccent: "شفافة", pricingTitleEnd: "لكل نطاق", pricingSubtitle: "اختر الخطة التي تناسب احتياجات عملك. بسيطة وقابلة للتطوير وقوية.", planPerMonth: "/شهريًا",
        plan1Name: "مبتدئ", plan1Desc: "مثالية للشركات الصغيرة والناشئة.", plan1Feat1: "حتى ١٠٠٠ QR code", plan1Feat2: "لوحة تحكم تحليلات أساسية", plan1Feat3: "قوالب QR code قياسية", plan1Feat4: "دعم عبر البريد الإلكتروني", plan1Cta: "اختر خطة المبتدئين",
        planPopularBadge: "الأكثر شيوعًا", plan2Name: "احترافي", plan2Desc: "للشركات النامية التي تحتاج إلى المزيد من القوة.", plan2Feat1: "حتى ١٠٠٠٠ QR code", plan2Feat2: "تحليلات وتقارير متقدمة", plan2Feat3: "جميع القوالب + التخصيص", plan2Feat4: "نظام الآراء والتقييمات", plan2Feat5: "دعم ذو أولوية عبر البريد الإلكتروني والدردشة", plan2Cta: "اختر الخطة الاحترافية",
        plan3Name: "مؤسسات", plan3Price: "مخصص", plan3Desc: "حلول مصممة خصيصًا للاحتياجات واسعة النطاق.", plan3Feat1: "عدد غير محدود من رموز QR code", plan3Feat2: "وصول كامل إلى API والتكاملات", plan3Feat3: "مدير حساب مخصص", plan3Feat4: "اتفاقية مستوى خدمة مخصصة ودعم متميز", plan3Cta: "اتصل بالمبيعات",
        ctaTitle: "ارتقِ بأمان علامتك التجارية مع <span class='hero-gradient-text'>QRified</span>.", ctaSubtitle: "ادخل إلى مستقبل مصادقة المنتجات. احمِ علامتك التجارية، وأشرك العملاء، وحقق النمو.", ctaButton: "اطلب عرضًا توضيحيًا",
        footerBrandName: "QRified", footerTagline: "مستقبل المصادقة الآمنة.", footerCompanyName: "QRified Technologies Ltd (15374908)", footerAddr1: "275 طريق إن الجديد، لندن، N1 7AA", footerCountry: "المملكة المتحدة",
        footerProductColTitle: "المنتج", footerProductLink1: "الميزات الأساسية", footerProductLink2: "مجموعة الأدوات", footerProductLink3: "الأسعار", footerProductLink4: "الأمان", footerProductLink5: "التكاملات", footerProductLink6: "API (قريبًا)",
        footerCompanyColTitle: "الشركة", footerCompanyLink1: "من نحن", footerCompanyLink2: "المدونة", footerCompanyLink3: "وظائف", footerCompanyLink4: "اتصل بنا", footerCompanyLink5: "الشركاء",
        footerResourcesColTitle: "الموارد", footerResourcesLink1: "المستندات", footerResourcesLink2: "مركز الدعم", footerResourcesLink3: "الأسئلة الشائعة", footerResourcesLink4: "دراسات الحالة", footerResourcesLink5: "منتدى المجتمع",
        footerCopyright: "QRified Technologies Ltd. جميع الحقوق محفوظة.", footerPrivacy: "سياسة الخصوصية", footerTerms: "الشروط والأحكام", footerCookies: "سياسة ملفات تعريف الارتباط",
    }
};

// Helper function to get translated text
const useTranslation = (lang) => {
    return (key, options = {}) => {
        let text = translations[lang]?.[key] || translations.en[key] || key;
        // Basic placeholder replacement, can be expanded
        if (options.count) {
            text = text.replace('{{count}}', options.count);
        }
        return text;
    };
};

// Component for rendering translated text, handling HTML
const TranslatedText = ({ translationKey, lang, options, as = "p", className = "" }) => {
    const t = useTranslation(lang);
    const translatedString = t(translationKey, options);

    const Tag = as;

    // Keys that are known to contain HTML
    const htmlKeys = ['heroTitle', 'feature1TitleAccent', 'feature2TitleAccent', 'feature3TitleAccent', 'toolsTitleAccent', 'perksTitleAccent', 'blogTitleAccent', 'pricingTitleAccent', 'ctaTitle'];
    const isHtml = htmlKeys.includes(translationKey) || (translationKey.includes('TitleLead') && translatedString.includes('<span'));

    if (isHtml) {
        return <Tag className={className} dangerouslySetInnerHTML={{ __html: translatedString }} />;
    }
    return <Tag className={className}>{translatedString}</Tag>;
};

const AuroraBackground = () => <div className="aurora-bg"></div>;

const Header = ({ lang, t, onToggleTheme, currentTheme, onToggleLang, onToggleMobileMenu, isMobileMenuOpen }) => {
    // const { user, logout } = useAuth(); // Example if using AuthContext
    const headerRef = useRef(null);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        let lastScrollTop = 0;
        const handleScroll = () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            if (window.scrollY > 50) {
                header.classList.add('shadow-xl');
                if (document.body.classList.contains('light-mode')) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                } else {
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
                }
            } else {
                header.classList.remove('shadow-xl');
                 if (document.body.classList.contains('light-mode')) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                } else {
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentTheme]);
    
    const handleNavLinkClick = (e) => {
        if (e.target.hash && e.target.hash.startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.hash;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerEl = headerRef.current;
                const headerOffset = headerEl ? headerEl.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                if (isMobileMenuOpen) onToggleMobileMenu();
            }
        }
    };

    return (
        <header ref={headerRef} className="py-4 px-4 sm:px-6 lg:px-8 fixed w-full z-50" style={{ transform: 'translateY(0px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <a href="#" className="text-2xl font-bold hero-gradient-text flex items-center">
                    <TranslatedText translationKey="brandName" lang={lang} as="span" />
                    <span className="beta-badge beta-badge-gradient">
                        <TranslatedText translationKey="betaBadge" lang={lang} as="span" />
                    </span>
                </a>
                <div className="hidden md:flex items-center space-x-6">
                    <a href="/Index#main-features" onClick={handleNavLinkClick}><TranslatedText translationKey="navFeatures" lang={lang} options={{}} as="span" /></a>
                    <a href="/Index#perks" onClick={handleNavLinkClick}><TranslatedText translationKey="navPerks" lang={lang} options={{}} as="span" /></a>
                    <a href="/BlogPage"><TranslatedText translationKey="navBlog" lang={lang} options={{}} as="span" /></a>
                    <a href="/Index#pricing" onClick={handleNavLinkClick}><TranslatedText translationKey="navPricing" lang={lang} options={{}} as="span" /></a>
                    <a href="/DocumentationPage"><TranslatedText translationKey="navDocs" lang={lang} options={{}} as="span" /></a>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" title="Toggle theme" onClick={onToggleTheme} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {currentTheme === 'dark' ? <Sun id="theme-icon-sun" className="block w-5 h-5" /> : <Moon id="theme-icon-moon" className="block w-5 h-5" />}
                    </Button>
                    <a href="/Login" className="text-sm hidden sm:block"><TranslatedText translationKey="navLogin" lang={lang} options={{}} as="span" /></a>
                    <Button variant="primary" size="sm" data-translation-key="navGetStarted" href="/Signup">
                        <TranslatedText translationKey="navGetStarted" lang={lang} options={{}} as="span" />
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMobileMenu}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </nav>
            {isMobileMenuOpen && (
                <div id="mobileMenu" className="md:hidden mt-3 py-2 rounded-md shadow-xl">
                    <a href="/Index#main-features" onClick={handleNavLinkClick} className="block px-4 py-2 text-sm"><TranslatedText translationKey="navFeaturesMobile" lang={lang} options={{}} as="span" /></a>
                    <a href="/Index#perks" onClick={handleNavLinkClick} className="block px-4 py-2 text-sm"><TranslatedText translationKey="navPerksMobile" lang={lang} options={{}} as="span" /></a>
                    <a href="/BlogPage" className="block px-4 py-2 text-sm"><TranslatedText translationKey="navBlogMobile" lang={lang} options={{}} as="span" /></a>
                    <a href="/Index#pricing" onClick={handleNavLinkClick} className="block px-4 py-2 text-sm"><TranslatedText translationKey="navPricingMobile" lang={lang} options={{}} as="span" /></a>
                    <a href="/DocumentationPage" className="block px-4 py-2 text-sm"><TranslatedText translationKey="navDocsMobile" lang={lang} options={{}} as="span" /></a>
                    <a href="/Login" className="block px-4 py-2 text-sm"><TranslatedText translationKey="navLoginMobile" lang={lang} options={{}} as="span" /></a>
                </div>
            )}
        </header>
    );
};

const HeroSection = ({ lang, t }) => {
    return (
        <section className="relative min-h-screen pt-24 flex items-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJoNnptLTYgNmMwLTYuNjI3LTUuMzczLTEyLTEyLTEydjZjMy4zMTQgMCA2IDIuNj everlasting code ...

