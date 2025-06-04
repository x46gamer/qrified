import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, easeInOut } from 'framer-motion';
import { QrCode, Menu, X, Shield, Lock, Key, Eye, Zap, CheckCircle, Activity, MapPin, BarChart, AlertTriangle, Fingerprint, Check, XCircle } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { QrCodeAnimation } from './components/QrCodeAnimation';
import { Button } from './components/Button';
import { SectionTitle } from './components/SectionTitle';
import { ParallaxLayer } from './components/ParallaxLayer';
import { Feature } from './components/Feature';


// HeroSection Component
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1b2xlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMThjMC05Ljk0LTguMDYtMTgtMTgtMTh2NmM2LjYyNyAwIDEyIDUuMzczIDEyIDEyaDZ6bS02IDZjMC02LjYyNy01LjM3My0xMi0xMi0xMnY2YzMuMzE0IDAgNiAyLjY4NiA2IDZ2NnoiIGZpbGw9InJnYmEoMTAwLDEwMCwxMDAsMC4wMikgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==')] opacity-30 z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col max-w-xl"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary-600 font-semibold mb-2"
            >
              Scan the Future
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Your Unbreakable Seal of Authenticity
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-600 mb-8"
            >
              Qrified offers cutting-edge product authentication through secure, 
              dynamic QR codes. Protect your brand, engage your customers, and 
              gain invaluable insights with the gold standard in anti-counterfeiting.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button href="#cta" size="lg">
                Start Free Trial
              </Button>
              <Button href="#product" variant="outline" size="lg">
                How It Works
              </Button>
            </motion.div>
          </motion.div>
          
          <div className="w-full h-[400px] md:h-[500px]">
            <QrCodeAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

// WhyQrifiedSection Component
const WhyQrifiedSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [100, 0, 0]);

  return (
    <section 
      id="why" 
      ref={ref}
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <ParallaxLayer speed={0.2} direction="right" className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-primary-50 opacity-60 blur-3xl z-0" />
      <ParallaxLayer speed={0.3} direction="left" className="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-accent-50 opacity-60 blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Trust in a Single Tap"
          title="Why Choose Qrified"
          description="Our cutting-edge authentication platform delivers unmatched security, seamless integration, and actionable insights - all through a simple scan."
        />
        
        <motion.div 
          style={{ opacity, y }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <Feature 
            icon={Shield}
            title="Tamper-Proof Security"
            description="Military-grade encryption and blockchain verification ensure your QR codes can't be duplicated or falsified."
            delay={0.1}
          />
          <Feature 
            icon={Zap}
            title="Instant Verification"
            description="Customers can verify authenticity in seconds with a simple scan using any smartphone."
            delay={0.2}
          />
          <Feature 
            icon={BarChart}
            title="Actionable Insights"
            description="Gain valuable data on when, where, and how often your products are being verified."
            delay={0.3}
          />
          <Feature 
            icon={Fingerprint}
            title="Unique Identity"
            description="Each product receives a unique digital signature that can't be replicated or spoofed."
            delay={0.4}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 p-8 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Protecting over 50 million products worldwide
              </h3>
              <p className="text-gray-600">
                From luxury goods to pharmaceuticals, Qrified's technology is trusted by industry leaders to protect their products and customers.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Products Protected', value: '50M+' },
                { label: 'Scans Processed', value: '120M+' },
                { label: 'Countries Served', value: '60+' },
                { label: 'Client Satisfaction', value: '99.8%' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// SecuritySection Component
const SecuritySection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.8, 1, 1]);

  return (
    <section 
      id="security" 
      ref={ref}
      className="py-20 md:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <ParallaxLayer speed={0.2} direction="left" className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-50 opacity-60 blur-3xl z-0" />
      <ParallaxLayer speed={0.3} direction="right" className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-50 opacity-50 blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Engineered Like a Vault"
          title="Uncompromising Security"
          description="We've built our platform with security as the foundation, implementing multiple layers of protection to ensure your authentication system is impenetrable."
        />
        
        <motion.div 
          style={{ opacity, scale }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="col-span-1 lg:col-span-1 flex flex-col">
            {[
              { 
                icon: Shield, 
                title: "OWASP Top 10 Compliant", 
                description: "Our platform is built following the strictest security guidelines in the industry." 
              },
              { 
                icon: Lock, 
                title: "End-to-End Encryption", 
                description: "All data is encrypted at rest and in transit using AES-256 and TLS 1.3." 
              },
              { 
                icon: Key, 
                title: "Multi-Factor Authentication", 
                description: "Add an extra layer of security to your authentication process." 
              },
              { 
                icon: Eye, 
                title: "Anomaly Detection", 
                description: "Our AI algorithms continuously monitor for suspicious scanning patterns." 
              },
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="flex items-start mb-8"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600 mr-4">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="p-1 bg-gradient-to-r from-primary-400 to-accent-400">
                <div className="bg-white p-6 md:p-8 rounded-t-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Security Architecture
                  </h3>
                  
                  <div className="relative h-[400px] rounded-lg bg-gray-50 p-4 border border-gray-100">
                    {/* Abstract security visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-4 border-primary-200 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.3s' }}>
                        <div className="w-36 h-36 border-4 border-primary-300 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.2s' }}>
                          <div className="w-24 h-24 border-4 border-primary-400 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '0.1s' }}>
                            <div className="w-12 h-12 bg-primary-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security layers labels */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="absolute top-5 left-5"
                    >
                      <div className="bg-white shadow-sm rounded px-3 py-1 text-xs font-medium text-gray-700">
                        Network Security Layer
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="absolute top-5 right-5"
                    >
                      <div className="bg-white shadow-sm rounded px-3 py-1 text-xs font-medium text-gray-700">
                        Application Security
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 1 }}
                      className="absolute bottom-5 left-5"
                    >
                      <div className="bg-white shadow-sm rounded px-3 py-1 text-xs font-medium text-gray-700">
                        Data Encryption
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="absolute bottom-5 right-5"
                    >
                      <div className="bg-white shadow-sm rounded px-3 py-1 text-xs font-medium text-gray-700">
                        Access Control
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 1.4 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="bg-primary-50 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-primary-700">
                        Your Data
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Industry Compliance & Certifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'ISO 27001', 'GDPR', 'CCPA', 'SOC 2 Type II',
                  ].map((cert, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="bg-gray-50 rounded-lg p-3 text-center"
                    >
                      <span className="text-sm font-medium text-gray-700">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ProductFlowSection Component
const ProductFlowSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [100, 0, 0]);

  const steps = [
    {
      icon: QrCode,
      title: "Create & Deploy",
      description: "Generate unique, secure QR codes for your products and deploy them across your packaging or labels.",
    },
    {
      icon: Zap,
      title: "Customers Scan",
      description: "When customers scan the QR code with any smartphone, they instantly verify authenticity and access digital experiences.",
    },
    {
      icon: CheckCircle,
      title: "Insights & Protection",
      description: "You gain valuable data on product interactions while protecting your brand from counterfeiting.",
    },
  ];

  return (
    <section 
      id="product" 
      ref={ref}
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <ParallaxLayer speed={0.2} direction="left" className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-accent-50 opacity-50 blur-3xl z-0" />
      <ParallaxLayer speed={0.3} direction="right" className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-50 opacity-60 blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Authentication in Motion"
          title="How Qrified Works"
          description="Our seamless process makes product authentication simple for you and your customers, while providing powerful protection and insights."
        />
        
        <motion.div 
          style={{ opacity, y }}
          className="mt-16 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-12 h-12 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-600 z-10 relative">
                    <step.icon size={24} />
                  </div>
                  <div className="absolute -inset-2 bg-primary-50 rounded-full opacity-30 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 bg-gray-50 rounded-xl p-8 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-8 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join leading brands already protecting their products and customers with Qrified's authentication platform.
                </p>
                <Button href="#cta">Try It Now</Button>
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full text-primary-600 mb-4">
                      <QrCode size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Integration Timeline</h4>
                  </div>
                  
                  <ul className="space-y-4">
                    {[
                      { time: 'Instant', activity: 'Create your first QR code' },
                      { time: '5 mins', activity: 'Customize your design' },
                      { time: '10 mins', activity: 'Link your custom domain' },
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <div className="w-16 flex-shrink-0 font-medium text-gray-900">{item.time}</div>
                        <div className="flex-1 text-gray-600">{item.activity}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// LiveDemoSection Component
const LiveDemoSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [50, 0, 0]);

  const handleVerify = () => {
    // Simulate verification process
    setIsVerified(null);
    setTimeout(() => {
      setIsVerified(true);
    }, 1500);
  };

  const handleFake = () => {
    // Simulate fake verification
    setIsVerified(null);
    setTimeout(() => {
      setIsVerified(false);
    }, 1500);
  };

  return (
    <section 
      ref={ref}
      className="py-20 md:py-32 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          style={{ opacity, y }}
          className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto"
        >
          <div className="p-1 bg-gradient-to-r from-primary-400 to-accent-400">
            <div className="bg-white p-6 md:p-8 rounded-t-lg">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 mb-8 md:mb-0 md:mr-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Scan It Yourself
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Experience Qrified's verification technology with this interactive demo. 
                    See how customers can instantly verify product authenticity with a simple scan.
                  </p>
                  
                  <div className="space-y-4">
                    <Button onClick={handleVerify}>
                      Verify Authentic Product
                    </Button>
                    <Button variant="outline" onClick={handleFake}>
                      Try Counterfeit Example
                    </Button>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-full md:w-auto">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 w-full md:w-[240px] aspect-square flex flex-col items-center justify-center relative">
                    <QrCode size={160} className="text-gray-900" />
                    
                    {isVerified === true && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center"
                      >
                        <CheckCircle size={60} className="text-success-500 mb-4" />
                        <p className="text-lg font-semibold text-gray-900">Authentic</p>
                        <p className="text-sm text-gray-600 mt-1">Verified by Qrified</p>
                      </motion.div>
                    )}
                    
                    {isVerified === false && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center"
                      >
                        <XCircle size={60} className="text-error-500 mb-4" />
                        <p className="text-lg font-semibold text-gray-900">Counterfeit</p>
                        <p className="text-sm text-gray-600 mt-1">Not verified by Qrified</p>
                      </motion.div>
                    )}
                    
                    {isVerified === null && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">
              What happens when a customer scans:
            </h3>
            <ul className="space-y-3">
              {[
                "QR code is scanned with any smartphone camera",
                "Our secure servers verify the authenticity in milliseconds",
                "Customer receives instant verification result",
                "You receive data on the scan location and time",
                "Optional: Redirect customers to product information, warranty registration, or exclusive content"
              ].map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <span className="text-primary-500 mr-3">•</span>
                  <span className="text-gray-600">{step}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// DashboardSection Component
const DashboardSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [100, 0, 0]);

  const dashboardFeatures = [
    {
      icon: Activity,
      title: "Real-Time Scan Activity",
      description: "Monitor authentication scans as they happen around the world.",
    },
    {
      icon: MapPin,
      title: "Geographic Insights",
      description: "Visualize where your products are being authenticated globally.",
    },
    {
      icon: BarChart,
      title: "Trend Analysis",
      description: "Track authentication patterns over time to optimize your strategy.",
    },
    {
      icon: AlertTriangle,
      title: "Counterfeit Alerts",
      description: "Get immediate notifications of potential counterfeit attempts.",
    },
  ];

  return (
    <section 
      id="dashboard" 
      ref={ref}
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <ParallaxLayer speed={0.2} direction="right" className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-primary-50 opacity-60 blur-3xl z-0" />
      <ParallaxLayer speed={0.3} direction="left" className="absolute bottom-40 -left-20 w-72 h-72 rounded-full bg-accent-50 opacity-50 blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Command Your Verification Network"
          title="Powerful Analytics Dashboard"
          description="Gain valuable insights into how your products are being authenticated and protected worldwide with our intuitive dashboard."
        />
        
        <motion.div 
          style={{ opacity, y }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-100"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 p-6 bg-accent-50 rounded-lg border border-accent-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Actionable Intelligence
              </h3>
              <p className="text-gray-700 mb-4">
                Your dashboard doesn't just show data—it provides insights you can act on immediately:
              </p>
              <ul className="space-y-2">
                {[
                  "Identify potential gray market activity with location anomalies",
                  "Discover engagement patterns to optimize product launches",
                  "Track conversion rates from authentications to website visits",
                  "Monitor supply chain integrity with batch tracking"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent-600 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="bg-gray-800 p-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-white text-sm mx-auto">Qrified Dashboard</div>
            </div>
            
            <div className="bg-white p-4">
              {/* Dashboard visualization */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Authentication Activity</h4>
                  <div className="text-xs text-gray-500">Last 30 days</div>
                </div>
                
                <div className="h-40 flex items-end space-x-2">
                  {[40, 25, 35, 30, 65, 45, 50, 40, 30, 35, 55, 60, 45].map((height, index) => (
                    <motion.div 
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.03 * index }}
                      className="flex-1 bg-primary-400 rounded-t"
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Total Scans</div>
                  <div className="text-2xl font-bold text-gray-900">127,492</div>
                  <div className="text-xs text-success-600 mt-1">+12.5% vs last month</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Avg. Daily Scans</div>
                  <div className="text-2xl font-bold text-gray-900">4,250</div>
                  <div className="text-xs text-success-600 mt-1">+8.3% vs last month</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Top Authentication Locations</h4>
                  <div className="text-xs text-gray-500">View all</div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { country: "United States", amount: "32,542", percent: 70 },
                    { country: "United Kingdom", amount: "15,848", percent: 55 },
                    { country: "Germany", amount: "12,105", percent: 40 },
                    { country: "Japan", amount: "8,940", percent: 30 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 flex-shrink-0 text-sm text-gray-600">{item.country}</div>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="bg-primary-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="w-16 flex-shrink-0 text-right text-sm text-gray-900 font-medium">
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// TestimonialsSection Component
const testimonials = [
  {
    quote: "Qrified has completely transformed how we protect our luxury handbags. Since implementing their authentication system, we've seen counterfeit attempts drop by 83%.",
    author: "Sarah Johnson",
    position: "Head of Product Security",
    company: "Luxe Fashion Group",
  },
  {
    quote: "The insights we get from the Qrified dashboard are invaluable. We can now see exactly where our products are being authenticated, helping us identify new markets and potential distribution issues.",
    author: "Michael Chen",
    position: "VP of Global Operations",
    company: "TechGear Industries",
  },
  {
    quote: "As a pharmaceutical company, product integrity is non-negotiable. Qrified provides the security we need with the simplicity our customers demand. It's been a game-changer.",
    author: "Dr. Elena Rodriguez",
    position: "Director of Supply Chain",
    company: "MediPharm Solutions",
  },
];

const TestimonialsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [50, 0, 0]);

  return (
    <section 
      ref={ref}
      className="py-20 md:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <ParallaxLayer speed={0.2} direction="left" className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary-50 opacity-50 blur-3xl z-0" />
      <ParallaxLayer speed={0.3} direction="right" className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-accent-50 opacity-60 blur-3xl z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Trusted by Innovators"
          title="What Our Clients Say"
          description="Leading brands across industries trust Qrified to secure their products and enhance customer confidence."
        />
        
        <motion.div 
          style={{ opacity, y }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative"
            >
              <div className="absolute top-6 right-6 text-5xl text-primary-100 font-serif">
                "
              </div>
              <p className="text-gray-600 mb-6 relative z-10">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
                <p className="text-sm text-primary-600">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Technology Proven by Industry Leaders
            </h2>
            <p className="text-gray-600 mb-8">
            Our authentication technology uses the same proven systems trusted by global brands to drive success.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mb-8">
            <div className="flex flex-col items-center">
              <img src="/logos/amazon.svg" alt="Amazon" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-500 mt-2">Reduced counterfeit by 89%</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/logos/alibaba.svg" alt="Alibaba" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-500 mt-2">Verified 1M+ products</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/logos/loreal.svg" alt="L'Oréal" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-500 mt-2">Enhanced brand trust</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/logos/dupont.svg" alt="DuPont" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-500 mt-2">Secured supply chain</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
          And just like industry leaders around the world, Qrified uses the same trusted authentication standards to ensure security.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// PricingSection Component
const PricingSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [100, 0, 0]);

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      monthlyPrice: 199,
      annualPrice: 149,
      features: [
        "Up to 5,000 QR codes",
        "Basic authentication",
        "Standard dashboard",
        "Email support",
        "1 admin user"
      ]
    },
    {
      name: "Business",
      description: "Ideal for growing businesses with more products",
      monthlyPrice: 399,
      annualPrice: 299,
      popular: true,
      features: [
        "Up to 50,000 QR codes",
        "Advanced authentication",
        "Full analytics dashboard",
        "Priority support",
        "5 admin users",
        "Custom QR branding",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      custom: true,
      features: [
        "Unlimited QR codes",
        "Enterprise-grade security",
        "Custom analytics",
        "Dedicated account manager",
        "Unlimited admin users",
        "White-label solution",
        "Advanced API integrations",
        "Custom development"
      ]
    }
  ];

  return (
    <section 
      id="pricing" 
      ref={ref}
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          subtitle="Only Pay for What You Protect"
          title="Simple, Transparent Pricing"
          description="Choose the plan that's right for your business. All plans include our core authentication technology."
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 25%)
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          style={{ opacity, y }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`bg-white rounded-xl overflow-hidden border ${
                plan.popular 
                  ? 'border-primary-200 shadow-lg' 
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-500 text-white text-center text-sm font-medium py-1">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {plan.description}
                </p>
                
                {plan.custom ? (
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-1">/ month</span>
                    {isAnnual && (
                      <div className="text-sm text-primary-600 mt-1">
                        Billed annually
                      </div>
                    )}
                  </div>
                )}
                
                <Button 
                  href="#cta" 
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.custom ? 'Contact Sales' : 'Get Started'}
                </Button>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-4">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check size={16} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-100 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            {[
              {
                q: "How quickly can I get set up with Qrified?",
                a: "Most customers are up and running within a week. Our team will guide you through the entire process, from initial setup to deployment."
              },
              {
                q: "Do I need special hardware to scan the QR codes?",
                a: "No, Qrified QR codes can be scanned with any standard smartphone camera - no special app or hardware required."
              },
              {
                q: "Can I customize the verification experience?",
                a: "Absolutely! You can fully customize the landing page customers see after scanning, including your branding, product information, and additional engagement features."
              },
              {
                q: "Is there a limit to how many times a QR code can be scanned?",
                a: "No, there are no scan limits. You can track unlimited scans for each QR code you deploy."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// CtaSection Component
const CtaSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.8], [0.9, 1, 1]);

  return (
    <section 
      id="cta" 
      ref={ref}
      className="py-20 md:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-accent-50 opacity-80 z-0"></div>
      
      <motion.div
        style={{ opacity, scale }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-3xl mx-auto text-center border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses worldwide who trust Qrified for
            unbreakable product authentication.
          </p>
          <Button href="#cta" size="lg">
            Launch Now
          </Button>
        </div>
      </motion.div>
    </section>
  );
};


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <WhyQrifiedSection />
        <SecuritySection />
        <ProductFlowSection />
        <LiveDemoSection />
        <DashboardSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;