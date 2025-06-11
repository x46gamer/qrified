import React, { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { Link, useNavigate } from 'react-router-dom'; // Not used for this single-page structure
// import { motion } from 'framer-motion'; // Not used as original HTML has no complex animations beyond CSS
// import { useAuth } from '../contexts/AuthContext'; // Placeholder if auth functions are needed

// Assuming Button is from shadcn/ui, if not, adjust the import
// For this example, we'll create a simple Button component if shadcn/ui is not set up
// const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

// Assuming HoverCard is from shadcn/ui, if not, adjust the import
// For this example, we'll create a simple HoverCard component if shadcn/ui is not set up
// const HoverCard = ({ children }) => <div>{children}</div>;
// const HoverCardTrigger = ({ children }) => <div>{children}</div>;
// const HoverCardContent = ({ children }) => <div>{children}</div>;


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
  Play,
  Moon,
  Sun,
  Menu,
  X,
  Grid,
  BarChart2,
  Sliders,
  Globe2,
  Key,
  Check,
  Smartphone,
  Clock,
  BarChart,
  ThumbsUp,
  Settings2,
  ShieldCheck,
  Edit3,
  FilePlus,
  Filter,
  Languages,
  Zap,
  DollarSign,
  Users2,
  HelpCircle,
  BookOpen,
  LifeBuoy,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  Share2,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Eye,
  User,
  Calendar,
  Tag,
  Search,
  UploadCloud,
  Database,
  Server,
  LockIcon,
  UnlockIcon,
  QrCode,
  List,
  LayoutDashboard,
  PieChart,
  Activity,
  Palette,
  ShieldAlert,
  FileLock,
  Columns,
  Layers,
  Package,
  Cpu,
  GitBranch,
  Terminal
} from 'lucide-react';

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

// Simple Button component to replicate ShadCN like behavior or custom styling
const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
    let baseStyle = "font-semibold rounded-lg transition duration-300 transform focus:outline-none";
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
        <section className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="text-center max-w-4xl mx-auto z-10">
                <TranslatedText translationKey="heroTitle" lang={lang} options={{}} as="h1" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-50 leading-tight" />
                <TranslatedText translationKey="heroSubtitle" lang={lang} options={{}} as="p" className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto" />
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button variant="primary" size="default" className="w-full sm:w-auto" href="/Signup">
                        <TranslatedText translationKey="heroCtaPrimary" lang={lang} options={{}} as="span" />
                    </Button>
                    <Button variant="secondary" size="default" href="/Index#main-features" className="w-full sm:w-auto">
                         <TranslatedText translationKey="heroCtaSecondary" lang={lang} options={{}} as="span" />
                    </Button>
                </div>
                <div className="mt-16 relative w-full max-w-2xl mx-auto">
                    <div className="aspect-[16/9] p-2 flex items-center justify-center image-placeholder card-bg">
                        <TranslatedText translationKey="heroImagePlaceholder" lang={lang} as="span" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeaturedInSection = ({ lang, t }) => {
    const LOREAL_SVG = (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 800 144.748" className="featured-logo-svg">
        <polyline points="435.229,135.009 538.465,135.009 538.465,122.399 452.927,122.399 452.927,82.049 517.176,82.049 517.176,69.29     452.927,69.29 452.927,32.115 538.465,32.115 538.465,19.551 435.229,19.551 435.229,135.009 "></polyline>
        <polyline points="488.878,0.887 474.901,16.589 518.778,0.887 488.878,0.887 "></polyline>
        <polyline points="711.773,122.399 711.773,19.551 695.637,19.551 695.637,135.009 800,135.009 800,122.399 711.773,122.399 "></polyline>
        <path d="M 605.359,19.551 L 546.652,135.009 L 566.496,135.009 L 581.515,105.125 L 651.925,105.125 L 667.072,135.009 L 686.711,135.009 L 627.957,19.551 L 605.359,19.551 M 588.946,90.653 L 616.61,35.505 L 644.598,90.653 L 588.946,90.653 z"></path>
        <path d="M 379.21,86.73 C 405.661,79.672 408.231,59.991 408.097,52.955 C 406.518,32.329 392.621,19.551 367.65,19.551 L 294.88,19.551 L 294.88,135.009 L 311.469,135.009 L 311.469,86.576 L 358.844,86.576 L 393.697,135.009 L 414.606,135.009 C 414.605,135.009 389.524,102.413 379.21,86.73 M 365.385,72.934 L 311.469,72.934 L 311.469,33.217 L 367.264,33.217 C 380.11,33.217 387.336,39.214 389.939,46.832 C 391.661,52.054 390.557,58.909 387.708,63.576 C 383.045,71.292 374.187,72.934 365.385,72.934 z"></path>
        <path d="M 195.188,0 C 148.36,0 116.443,33.017 116.443,72.979 C 116.443,115.049 151.7,144.748 195.188,144.748 C 238.647,144.748 273.89,115.473 273.89,72.979 C 273.89,33.017 241.578,0 195.188,0 M 194.626,130.416 C 162.228,130.416 135.534,104.381 135.534,73.018 C 135.534,41.698 160.968,14.416 195.882,14.416 C 229.931,14.416 254.96,41.698 254.96,73.018 C 254.96,104.38 227.01,130.416 194.626,130.416 z"></path>
        <polyline points="74.663,60.396 86.633,60.396 108.36,19.551 90.876,19.551 74.663,60.396 "></polyline>
        <polyline points="16.145,122.399 16.145,19.551 0,19.551 0,135.009 104.359,135.009 104.359,122.399 16.145,122.399 "></polyline>
      </svg>
    );

    return (
        <section id="featured-in" className="py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <TranslatedText translationKey="asFeaturedInTitle" lang={lang} options={{}} as="h2" className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-10" />
                <div className="featured-logos-container">
                    <img src="https://diplo-media.s3.eu-central-1.amazonaws.com/2024/09/227dd295-99df-4f13-86b8-767b17c69c04-1024x387.png" alt="Alibaba Logo" className="featured-logo" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x338/1A1A2E/E0E0E0?text=Image+Error'; }} />
                    <span className="logo-text-placeholder" style={{display:'none'}}>Alibaba</span>

                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className="featured-logo" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x338/1A1A2E/E0E0E0?text=Image+Error'; }} />
                    <span className="logo-text-placeholder" style={{display:'none'}}>Amazon</span>
                    
                    {LOREAL_SVG}

                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/DuPont_logo.svg/1920px-DuPont_logo.svg.png?20190528134144" alt="DuPont Logo" className="featured-logo" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x338/1A1A2E/E0E0E0?text=Image+Error'; }} />
                    <span className="logo-text-placeholder" style={{display:'none'}}>DuPont</span>
                </div>
            </div>
        </section>
    );
};

const TrustedBySection = ({ lang, t }) => {
    const brands = ["BrandOS", "NextGen Corp", "Innovate Ltd", "SecureGoods", "VerifyMe"];
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <TranslatedText translationKey="trustedByTitle" lang={lang} options={{}} as="p" className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8" />
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-12 lg:gap-x-16 opacity-60">
                    {brands.map(brand => (
                        <span key={brand} className="text-2xl sm:text-3xl font-medium text-gray-600">{brand}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

const MainFeature = ({ lang, t, titleLeadKey, titleAccentKey, descKey, itemsKeys, ctaKey, imagePlaceholderKey, imageFirst = false, bgColorClass = "" }) => {
    return (
        <section className={`main-feature-section py-16 sm:py-24 ${bgColorClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className={imageFirst ? "md:order-last" : ""}>
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 text-gray-50 section-title-underline">
                            <TranslatedText translationKey={titleLeadKey} lang={lang} options={{}} as="span" />{' '}
                            <span className="accent-gradient-text"><TranslatedText translationKey={titleAccentKey} lang={lang} options={{}} as="span" /></span>
                        </h2>
                        <TranslatedText translationKey={descKey} lang={lang} options={{}} as="p" className="text-lg text-gray-400 mb-6" />
                        <ul className="text-gray-300 space-y-3 mb-8">
                            {itemsKeys.map(itemKey => (
                                <li key={itemKey}><TranslatedText translationKey={itemKey} lang={lang} options={{}} as="span" /></li>
                            ))}
                        </ul>
                        <Button variant="secondary" href="/Index#main-features">
                            <TranslatedText translationKey={ctaKey} lang={lang} options={{}} as="span" />
                        </Button>
                    </div>
                    <div className={imageFirst ? "" : "md:order-last"}>
                        <div className="image-placeholder card-bg">
                            <TranslatedText translationKey={imagePlaceholderKey} lang={lang} options={{}} as="span" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ToolsSection = ({ lang, t }) => {
    const tools = [
        { icon: <Grid className="w-6 h-6"/>, titleKey: "tool1Title", descKey: "tool1Desc", iconBg: "bg-indigo-500", iconText: "text-indigo-400" },
        { icon: <FileText className="w-6 h-6"/>, titleKey: "tool2Title", descKey: "tool2Desc", iconBg: "bg-pink-500", iconText: "text-pink-400" },
        { icon: <Filter className="w-6 h-6"/>, titleKey: "tool3Title", descKey: "tool3Desc", iconBg: "bg-sky-500", iconText: "text-sky-400" },
        { icon: <Languages className="w-6 h-6"/>, titleKey: "tool4Title", descKey: "tool4Desc", iconBg: "bg-violet-500", iconText: "text-violet-400" },
        { icon: <LockIcon className="w-6 h-6"/>, titleKey: "tool5Title", descKey: "tool5Desc", iconBg: "bg-amber-500", iconText: "text-amber-400" },
        { icon: <ShieldCheck className="w-6 h-6"/>, titleKey: "tool6Title", descKey: "tool6Desc", iconBg: "bg-emerald-500", iconText: "text-emerald-400" },
    ];
    return (
        <section id="tools-section" className="py-16 sm:py-24 tools-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 section-title-underline centered-section-title-underline text-gray-50">
                        <TranslatedText translationKey="toolsTitleLead" lang={lang} options={{}} as="span" />{' '}
                        <span className="accent-gradient-text"><TranslatedText translationKey="toolsTitleAccent" lang={lang} options={{}} as="span" /></span>
                    </h2>
                    <TranslatedText translationKey="toolsSubtitle" lang={lang} options={{}} as="p" className="text-lg text-gray-400 max-w-2xl mx-auto mt-6" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {tools.map(tool => (
                        <div key={tool.titleKey} className="tool-card card-bg card-bg-hover">
                            <div className="tool-card-icon-wrapper">
                                <div className={`tool-card-icon ${tool.iconBg} bg-opacity-20 ${tool.iconText}`}>
                                    {tool.icon}
                                </div>
                            </div>
                            <TranslatedText translationKey={tool.titleKey} lang={lang} options={{}} as="h3" className="text-xl font-semibold text-gray-100" />
                            <TranslatedText translationKey={tool.descKey} lang={lang} options={{}} as="p" className="text-gray-400 text-sm leading-relaxed" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PerksSection = ({ lang, t }) => {
    const perks = [
        { icon: <ShieldCheck className="w-12 h-12 text-indigo-400"/>, titleKey: "perk1Title", descKey: "perk1Desc" },
        { icon: <Smartphone className="w-12 h-12 text-pink-400"/>, titleKey: "perk2Title", descKey: "perk2Desc" },
        { icon: <Clock className="w-12 h-12 text-sky-400"/>, titleKey: "perk3Title", descKey: "perk3Desc" },
        { icon: <TrendingUp className="w-12 h-12 text-violet-400"/>, titleKey: "perk4Title", descKey: "perk4Desc" },
        { icon: <ThumbsUp className="w-12 h-12 text-amber-400"/>, titleKey: "perk5Title", descKey: "perk5Desc" },
        { icon: <Settings2 className="w-12 h-12 text-emerald-400"/>, titleKey: "perk6Title", descKey: "perk6Desc" },
    ];
    return (
        <section id="perks" className="py-16 sm:py-24 bg-black bg-opacity-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 section-title-underline centered-section-title-underline text-gray-50">
                        <TranslatedText translationKey="perksTitleLead" lang={lang} options={{}} as="span" />{' '}
                        <span className="accent-gradient-text"><TranslatedText translationKey="perksTitleAccent" lang={lang} options={{}} as="span" /></span>
                    </h2>
                    <TranslatedText translationKey="perksSubtitle" lang={lang} options={{}} as="p" className="text-lg text-gray-400 max-w-2xl mx-auto mt-6" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {perks.map(perk => (
                        <div key={perk.titleKey} className="perk-card p-6 text-center card-bg card-bg-hover">
                            <div className="flex justify-center mb-4">{perk.icon}</div>
                            <TranslatedText translationKey={perk.titleKey} lang={lang} options={{}} as="h3" className="text-xl font-semibold mb-2 text-gray-100" />
                            <TranslatedText translationKey={perk.descKey} lang={lang} options={{}} as="p" className="text-gray-400 text-sm" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BlogSection = ({ lang, t }) => {
    const posts = [
        { img: "https://placehold.co/600x338/1A1A2E/E0E0E0?text=Blog+Image+1", categoryKey: "blog1Category", titleKey: "blog1Title", excerptKey: "blog1Excerpt", metaKey: "blog1Meta", authorImg: "https://placehold.co/32x32/4A5568/E0E0E0?text=A", categoryColor: "text-indigo-400", hoverColor: "hover:text-indigo-400" },
        { img: "https://placehold.co/600x338/1A1A2E/E0E0E0?text=Blog+Image+2", categoryKey: "blog2Category", titleKey: "blog2Title", excerptKey: "blog2Excerpt", metaKey: "blog2Meta", authorImg: "https://placehold.co/32x32/4A5568/E0E0E0?text=S", categoryColor: "text-pink-400", hoverColor: "hover:text-pink-400" },
        { img: "https://placehold.co/600x338/1A1A2E/E0E0E0?text=Blog+Image+3", categoryKey: "blog3Category", titleKey: "blog3Title", excerptKey: "blog3Excerpt", metaKey: "blog3Meta", authorImg: "https://placehold.co/32x32/4A5568/E0E0E0?text=M", categoryColor: "text-sky-400", hoverColor: "hover:text-sky-400" },
    ];
    return (
        <section id="blog" className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-50 section-title-underline">
                        <TranslatedText translationKey="blogTitleLead" lang={lang} options={{}} as="span" />{' '}
                        <span className="accent-gradient-text"><TranslatedText translationKey="blogTitleAccent" lang={lang} options={{}} as="span" /></span>
                    </h2>
                    <Button variant="secondary" href="/BlogPage">
                        <TranslatedText translationKey="blogViewAllCta" lang={lang} options={{}} as="span" />
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.titleKey} className="blog-card-minimal card-bg card-bg-hover">
                            <img src={post.img} alt="Blog post placeholder image" className="w-full h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x338/1A1A2E/E0E0E0?text=Image+Error'; }} />
                            <div className="blog-content">
                                <p className={`text-xs ${post.categoryColor} uppercase font-semibold mb-1`}><TranslatedText translationKey={post.categoryKey} lang={lang} options={{}} as="span" /></p>
                                <h3 className={`text-lg font-semibold mb-2 text-gray-100 ${post.hoverColor} transition`}><a href="#"><TranslatedText translationKey={post.titleKey} lang={lang} options={{}} as="span" /></a></h3>
                                <TranslatedText translationKey={post.excerptKey} lang={lang} options={{}} as="p" className="text-gray-400 text-sm mb-3 flex-grow" />
                                <div className="author-info flex items-center text-xs text-gray-500">
                                    <img src={post.authorImg} alt="Author" className="w-6 h-6 rounded-full mr-2" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/32x32/4A5568/E0E0E0?text=Err'; }} />
                                    <TranslatedText translationKey={post.metaKey} lang={lang} options={{}} as="span" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CallToActionSection = ({ lang, t }) => {
    const handleCheckout = async () => {
        try {
            // Replace 'YOUR_STRIPE_PRICE_ID' with your actual Stripe Price ID
            const priceId = 'YOUR_STRIPE_PRICE_ID'; 
            const response = await fetch('http://localhost:54321/functions/v1/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });
            const { sessionId } = await response.json();
            
            // Redirect to Stripe Checkout
            const stripe = await loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your public key
            stripe.redirectToCheckout({ sessionId });

        } catch (error) {
            console.error('Error creating checkout session:', error);
            // Optionally, display an error message to the user
        }
    };

    return (
        <section id="cta" className="relative py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 text-center">
                <TranslatedText
                    translationKey="ctaTitle"
                    lang={lang}
                    as="h2"
                    className="text-3xl md:text-5xl font-extrabold mb-4 text-neutral-900 dark:text-white leading-tight"
                />
                <TranslatedText
                    translationKey="ctaSubtitle"
                    lang={lang}
                    as="p"
                    className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8"
                />
                <Button 
                    onClick={handleCheckout}
                    variant="primary" 
                    size="lg" 
                    className="px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <CreditCard className="inline-block mr-2" />
                    Buy Now
                </Button>
            </div>
            {/* Aurora background remains unchanged */}
            <AuroraBackground />
        </section>
    );
};

const Footer = ({ lang, t, currentYear, onToggleLang }) => {
    const socialIcons = [
        { href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg> },
        { href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg> },
        { href: "#", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg> },
    ];
    const footerCols = [
        { titleKey: "footerProductColTitle", linksKeys: ["footerProductLink1", "footerProductLink2", "footerProductLink3", "footerProductLink4", "footerProductLink5", "footerProductLink6"] },
        { titleKey: "footerCompanyColTitle", linksKeys: ["footerCompanyLink1", "footerCompanyLink2", "footerCompanyLink3", "footerCompanyLink4", "footerCompanyLink5"] },
        { titleKey: "footerResourcesColTitle", linksKeys: ["footerResourcesLink1", "footerResourcesLink2", "footerResourcesLink3", "footerResourcesLink4", "footerResourcesLink5"] },
    ];

    return (
        <footer className="pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <a href="#" className="text-2xl font-bold hero-gradient-text mb-3 inline-block"><TranslatedText translationKey="footerBrandName" lang={lang} options={{}} as="span" /></a>
                        <TranslatedText translationKey="footerTagline" lang={lang} options={{}} as="p" className="text-sm text-gray-400 mb-1" />
                        <TranslatedText translationKey="footerCompanyName" lang={lang} options={{}} as="p" className="text-xs text-gray-500 mt-3" />
                        <TranslatedText translationKey="footerAddr1" lang={lang} options={{}} as="p" className="text-xs text-gray-500" />
                        <TranslatedText translationKey="footerCountry" lang={lang} options={{}} as="p" className="text-xs text-gray-500" />
                    </div>
                    {footerCols.map(col => (
                        <div key={col.titleKey}>
                            <TranslatedText translationKey={col.titleKey} lang={lang} options={{}} as="h5" className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4" />
                            <ul className="space-y-2.5">
                                {col.linksKeys.map(linkKey => (
                                    <li key={linkKey}><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition"><TranslatedText translationKey={linkKey} lang={lang} options={{}} as="span" /></a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-sm text-gray-500 order-2 sm:order-1 mt-4 sm:mt-0">
                        © {currentYear} <TranslatedText translationKey="footerCopyright" lang={lang} options={{}} as="span" />
                    </div>
                    <div className="flex items-center space-x-5 order-1 sm:order-2">
                        <div className="language-switcher flex space-x-1 sm:space-x-2 text-sm">
                            <button onClick={() => onToggleLang('en')} className={`lang-btn ${lang === 'en' ? 'active' : ''}`} title="Switch to English">EN</button>
                            <span className="text-gray-600">|</span>
                            <button onClick={() => onToggleLang('ar')} className={`lang-btn ${lang === 'ar' ? 'active' : ''}`} title="التحول إلى العربية">AR</button>
                        </div>
                        {socialIcons.map((social, index) => (
                            <a key={index} href={social.href} className="text-gray-500 hover:text-indigo-400 transition">
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-gray-600">
                    <a href="/PrivacyPolicyPage" className="hover:text-gray-400 px-2"><TranslatedText translationKey="footerPrivacy" lang={lang} options={{}} as="span" /></a> |
                    <a href="/TermsOfServicePage" className="hover:text-gray-400 px-2"><TranslatedText translationKey="footerTerms" lang={lang} options={{}} as="span" /></a> |
                    <a href="/CookiePolicyPage" className="hover:text-gray-400 px-2"><TranslatedText translationKey="footerCookies" lang={lang} options={{}} as="span" /></a>
                </div>
            </div>
        </footer>
    );
};

// Main App Component
const App = () => {
    const [currentTheme, setCurrentTheme] = useState('dark');
    const [currentLang, setCurrentLang] = useState('en');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const t = useTranslation(currentLang);

    // Theme toggle
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setCurrentTheme(storedTheme);
    }, []);

    useEffect(() => {
        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', currentTheme);
        // Trigger scroll to re-evaluate header style if needed
        window.dispatchEvent(new Event('scroll')); 
    }, [currentTheme]);

    const handleToggleTheme = () => {
        setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Language toggle
    useEffect(() => {
        const storedLang = localStorage.getItem('language') || 'en';
        setCurrentLang(storedLang);
    }, []);

    useEffect(() => {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', currentLang);
    }, [currentLang]);

    const handleToggleLang = (lang) => {
        setCurrentLang(lang);
    };
    
    // Mobile menu toggle
    const handleToggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    // Smooth scroll for all # links
    useEffect(() => {
        const smoothScrollHandler = (e) => {
            if (e.target.tagName === 'A' && e.target.hash && e.target.hash.startsWith('#')) {
                 const anchor = e.target;
                 // Check if it's a nav link handled by Header or a generic page link
                if (!anchor.closest('header nav') && !anchor.closest('#mobileMenu')) {
                    e.preventDefault();
                    const targetId = anchor.hash;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerEl = document.querySelector('header');
                        const headerOffset = headerEl ? headerEl.offsetHeight : 70;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        };
        document.addEventListener('click', smoothScrollHandler);
        return () => document.removeEventListener('click', smoothScrollHandler);
    }, []);


    // CSS styles from the original HTML
    // In a real React app, this would go into an imported CSS file or a CSS-in-JS solution
    const globalStyles = `
        body {
            font-family: 'Inter', sans-serif;
            background-color: #000000; 
            color: #E5E7EB; 
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        html[dir="rtl"] body {
            font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
        }
        html[dir="rtl"] h1, html[dir="rtl"] h2, html[dir="rtl"] h3, html[dir="rtl"] h4, html[dir="rtl"] h5, html[dir="rtl"] .font-semibold {
            font-weight: 600; 
        }
        .hero-gradient-text {
            background: linear-gradient(90deg, #6366F1, #EC4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .accent-gradient-text {
            background: linear-gradient(90deg, #38BDF8, #A78BFA);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .button-primary {
            background-image: linear-gradient(to right, #4F46E5 0%, #7C3AED 50%, #EC4899 100%);
            background-size: 200% auto;
            transition: background-position 0.5s ease;
            color: #FFFFFF;
        }
        .button-primary:hover {
            background-position: right center;
        }
        .button-secondary {
            border-width: 1px;
            border-color: #374151; 
            color: #D1D5DB; 
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .button-secondary:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: #4B5563; 
            color: #F3F4F6; 
        }
        .aurora-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -10; overflow: hidden; transition: opacity 0.5s ease;
        }
        .aurora-bg::before, .aurora-bg::after {
            content: ''; position: absolute; width: 80vw; height: 80vh;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%); 
            border-radius: 50%; filter: blur(100px); opacity: 0.7;
            animation: animateAurora 20s infinite alternate ease-in-out;
        }
        .aurora-bg::after {
            width: 70vw; height: 70vh;
            background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%); 
            animation-delay: -10s; animation-duration: 25s;
        }
        @keyframes animateAurora {
            0% { transform: translate(-20%, -20%) scale(1); }
            50% { transform: translate(20%, 10%) scale(1.2); }
            100% { transform: translate(-20%, -20%) scale(1); }
        }
        .section-title-underline { position: relative; display: inline-block; padding-bottom: 8px; }
        .section-title-underline::after {
            content: ''; position: absolute; left: 0; bottom: 0px; width: 50px; height: 3px;
            background: linear-gradient(90deg, #6366F1, #EC4899); border-radius: 2px;
        }
        html[dir="rtl"] .section-title-underline::after { left: auto; right: 0; }
        .centered-section-title-underline::after { left: 50%; transform: translateX(-50%); }
        html[dir="rtl"] .centered-section-title-underline::after { right: 50%; transform: translateX(50%); }
        .card-bg { background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); }
        .card-bg-hover:hover { border-color: rgba(79, 70, 229, 0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(79, 70, 229, 0.2); }
        .feature-card-minimal, .perk-card, .blog-card-minimal, .tool-card, .pricing-card { 
            border-radius: 12px; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
            display: flex; flex-direction: column;
        }
        .feature-card-minimal:hover, .perk-card:hover, .blog-card-minimal:hover, .tool-card:hover { transform: translateY(-5px); }
        .pricing-card.popular { border-color: #EC4899; }
        .pricing-card:hover:not(.popular) { border-color: rgba(79, 70, 229, 0.5); }
        .image-placeholder {
            background-color: rgba(255, 255, 255, 0.05); border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 8px; display: flex; align-items: center; justify-content: center;
            min-height: 300px; width: 100%; color: rgba(255, 255, 255, 0.4);
            font-size: 1rem; aspect-ratio: 16/10; 
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #4F46E5; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #EC4899; }
        header { /* Handled by JS, but base styles are good */
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: background-color 0.3s ease, border-bottom-color 0.3s ease, transform 0.3s ease-in-out;
        }
        header nav a, header button:not(#theme-toggle) { color: #D1D5DB; }
        header nav a:hover, header button:not(#theme-toggle):hover { color: #FFFFFF; }
        #theme-toggle { color: #D1D5DB; } #theme-toggle:hover { color: #FFFFFF; }
        #mobileMenu { background-color: rgba(0, 0, 0, 0.8); transition: background-color 0.3s ease; }
        #mobileMenu a { color: #D1D5DB; } #mobileMenu a:hover { background-color: #1F2937; color: #FFFFFF; } 
        .main-feature-section ul li { position: relative; padding-left: 1.75rem; margin-bottom: 0.75rem; font-size: 1.05em; }
        html[dir="rtl"] .main-feature-section ul li { padding-left: 0; padding-right: 1.75rem; }
        .main-feature-section ul li::before {
            content: '✓'; position: absolute; left: 0; color: #6366F1; font-weight: bold; font-size: 1.2em; 
        }
        html[dir="rtl"] .main-feature-section ul li::before { left: auto; right: 0; }
        .tools-section .tool-card { padding: 1.5rem; text-align: center; }
        html[dir="rtl"] .tools-section .tool-card { text-align: right; }
        .tools-section .tool-card-icon-wrapper { display: flex; justify-content: center; margin-bottom: 1rem; }
        .tools-section .tool-card-icon {
            width: 3rem; height: 3rem; padding: 0.5rem; display: flex; align-items: center; justify-content: center;
            border-radius: 0.5rem; transition: background-color 0.3s ease;
        }
        .tools-section .tool-card h3 { margin-bottom: 0.75rem; }
        .tools-section .tool-card p { padding-left: 0.5rem; padding-right: 0.5rem; }
        .blog-card-minimal img { aspect-ratio: 16/9; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px; }
        .blog-card-minimal .blog-content { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
        .blog-card-minimal .author-info { margin-top: auto; padding-top: 1rem; }
        html[dir="rtl"] .blog-card-minimal .author-info img { margin-left: 0.5rem; margin-right: 0; }
        body.light-mode { background-color: #F9FAFB; color: #1F2937; }
        body.light-mode .aurora-bg { opacity: 0.3; }
        body.light-mode header { border-bottom-color: #E5E7EB; }
        body.light-mode header nav a, body.light-mode header button:not(#theme-toggle) { color: #374151; }
        body.light-mode header nav a:hover, body.light-mode header button:not(#theme-toggle):hover { color: #111827; }
        body.light-mode #theme-toggle { color: #374151; } body.light-mode #theme-toggle:hover { color: #111827; }
        body.light-mode #mobileMenu { background-color: rgba(255, 255, 255, 0.9); }
        body.light-mode #mobileMenu a { color: #374151; } body.light-mode #mobileMenu a:hover { background-color: #F3F4F6; color: #111827; } 
        body.light-mode .text-gray-50 { color: #111827 !important; } 
        body.light-mode .text-gray-100 { color: #1F2937 !important; }
        body.light-mode .text-gray-300 { color: #4B5563 !important; } 
        body.light-mode .text-gray-400 { color: #6B7280 !important; } 
        body.light-mode .text-gray-500 { color: #6B7280 !important; }
        body.light-mode .text-gray-600 { color: #4B5563 !important; }
        body.light-mode .text-gray-700 { color: #374151 !important; }
        body.light-mode .text-gray-800 { color: #1F2937 !important; }
        body.light-mode { background-color: #F3F4F6 !important; } 
        body.light-mode .bg-opacity-20 { background-color: rgba(230, 232, 235, 0.5) !important; } 
        body.light-mode .bg-opacity-30 { background-color: rgba(221, 223, 228, 0.6) !important; }
        body.light-mode .card-bg { background-color: #FFFFFF; border-color: #E5E7EB; }
        body.light-mode .card-bg-hover:hover { border-color: #A5B4FC; box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 0 20px rgba(99, 102, 241, 0.1); }
        body.light-mode .button-secondary { border-color: #D1D5DB; color: #374151; }
        body.light-mode .button-secondary:hover { background-color: #F3F4F6; border-color: #9CA3AF; color: #111827; }
        body.light-mode .image-placeholder { background-color: #F3F4F6; border-color: #D1D5DB; color: #9CA3AF; }
        body.light-mode ::-webkit-scrollbar-track { background: #F3F4F6; }
        body.light-mode ::-webkit-scrollbar-thumb { background: #A5B4FC; }
        body.light-mode ::-webkit-scrollbar-thumb:hover { background: #C7D2FE; }
        body.light-mode .tools-section .tool-card { background-color: #FFFFFF; border-color: #E5E7EB; }
        body.light-mode .tools-section .tool-card:hover { border-color: #C4B5FD; }
        body.light-mode .pricing-card.popular { border-color: #F472B6; }
        body.light-mode .pricing-card:hover:not(.popular) { border-color: #A5B4FC; }
        body.light-mode footer { border-top-color: #E5E7EB; }
        .beta-badge {
            display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 0.125rem 0.375rem; 
            border-radius: 0.25rem; margin-left: 0.5rem; vertical-align: middle; line-height: 1; 
        }
        html[dir="rtl"] .beta-badge { margin-left: 0; margin-right: 0.5rem; }
        .beta-badge-gradient { background: linear-gradient(90deg, #6366F1, #EC4899); color: white; }
        body.light-mode .beta-badge-gradient { background: linear-gradient(90deg, #818CF8, #F472B6); }
        #theme-toggle svg { width: 1.25rem; height: 1.25rem; }
        .language-switcher button {
            padding: 0.25rem 0.5rem; border-radius: 0.25rem; transition: background-color 0.2s ease, color 0.2s ease;
            font-weight: 500;
        }
        .language-switcher button.active { background-color: #4F46E5; color: white; }
        body.light-mode .language-switcher button.active { background-color: #6366F1; }
        .language-switcher button:not(.active):hover { background-color: rgba(255, 255, 255, 0.1); }
        body.light-mode .language-switcher button:not(.active):hover { background-color: rgba(0, 0, 0, 0.05); }
        .featured-logos-container { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2rem; }
        .featured-logo, .featured-logo-svg { height: 36px; max-width: 140px; object-fit: contain; transition: filter 0.3s ease, opacity 0.3s ease, fill 0.3s ease; }
        .featured-logo { filter: grayscale(1) brightness(1.5); opacity: 0.7; }
        .featured-logo-svg { fill: #ffffff; filter: grayscale(1) brightness(1.5); opacity: 0.7; }
        .featured-logo:hover, .featured-logo-svg:hover { filter: grayscale(0) brightness(1); opacity: 1; }
        body.light-mode .featured-logo { filter: grayscale(1) brightness(0.5) contrast(1.2); opacity: 0.6; }
        body.light-mode .featured-logo-svg { fill: #1F2937; filter: grayscale(1) brightness(0.5) contrast(1.2); opacity: 0.6; }
        body.light-mode .featured-logo:hover, body.light-mode .featured-logo-svg:hover { filter: grayscale(0) brightness(1) contrast(1); opacity: 1; }
        .logo-text-placeholder { font-size: 1.25rem; font-weight: bold; color: #6B7280; padding: 0.5rem 1rem; border: 1px dashed #4B5563; border-radius: 0.375rem; }
        body.light-mode .logo-text-placeholder { color: #9CA3AF; border-color: #D1D5DB; }
    `;

    return (
        <>
            <style>{globalStyles}</style>
            <AuroraBackground />
            <Header 
                lang={currentLang} 
                t={t} 
                onToggleTheme={handleToggleTheme} 
                currentTheme={currentTheme}
                onToggleLang={handleToggleLang}
                onToggleMobileMenu={handleToggleMobileMenu}
                isMobileMenuOpen={isMobileMenuOpen}
            />
            <main>
                <HeroSection lang={currentLang} t={t} />
                <FeaturedInSection lang={currentLang} t={t} />
                <TrustedBySection lang={currentLang} t={t} />
                <div id="main-features">
                    <MainFeature 
                        lang={currentLang} t={t}
                        titleLeadKey="feature1TitleLead" titleAccentKey="feature1TitleAccent" descKey="feature1Desc"
                        itemsKeys={["feature1Item1", "feature1Item2", "feature1Item3", "feature1Item4"]}
                        ctaKey="feature1Cta" imagePlaceholderKey="feature1ImagePlaceholder"
                        bgColorClass="bg-black bg-opacity-20"
                    />
                    <MainFeature 
                        lang={currentLang} t={t}
                        titleLeadKey="feature2TitleLead" titleAccentKey="feature2TitleAccent" descKey="feature2Desc"
                        itemsKeys={["feature2Item1", "feature2Item2", "feature2Item3", "feature2Item4"]}
                        ctaKey="feature2Cta" imagePlaceholderKey="feature2ImagePlaceholder"
                        imageFirst={true}
                    />
                    <MainFeature 
                        lang={currentLang} t={t}
                        titleLeadKey="feature3TitleLead" titleAccentKey="feature3TitleAccent" descKey="feature3Desc"
                        itemsKeys={["feature3Item1", "feature3Item2", "feature3Item3", "feature3Item4"]}
                        ctaKey="feature3Cta" imagePlaceholderKey="feature3ImagePlaceholder"
                        bgColorClass="bg-black bg-opacity-20"
                    />
                </div>
                <ToolsSection lang={currentLang} t={t} />
                <PerksSection lang={currentLang} t={t} />
                <BlogSection lang={currentLang} t={t} />
                <CallToActionSection lang={currentLang} t={t} />
            </main>
            <Footer lang={currentLang} t={t} currentYear={currentYear} onToggleLang={handleToggleLang} />
        </>
    );
};

export default App;

