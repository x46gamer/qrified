import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, easeInOut } from 'framer-motion';
import { QrCode, Menu, X, Shield, Lock, Key, Eye, Zap, CheckCircle, Activity, MapPin, BarChart, AlertTriangle, Fingerprint, Check, XCircle, Twitter, Linkedin, Facebook, Instagram, Github, Sun, Moon } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Import components
import { Navbar } from '../src/components/Navbar';
import { Footer } from '../src/components/Footer';
import { LoadingScreen } from '../src/components/LoadingScreen';
import { QrCodeAnimation } from '../src/components/QrCodeAnimation';
import { Button } from '../src/components/Button';
import { SectionTitle } from '../src/components/SectionTitle';
import { ParallaxLayer } from '../src/components/ParallaxLayer';
import { Feature } from '../src/components/Feature';

// HeroSection Component
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJoNnptLTYgNmMwLTYuNjI3LTUuMzczLTEyLTEyLTEydjZjMy4zMTQgMCA2IDIuNjg2IDYgNnY2eiIgZmlsbD0icmdiYSgxMDAsMTAwLDEwMCwwLjAyKSBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')] opacity-30 z-0"></div>
      
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

// ... Rest of the components from App copy.tsx ...

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