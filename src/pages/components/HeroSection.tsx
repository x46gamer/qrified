import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { QrCode, ArrowDown } from 'lucide-react';
import { QrCodeAnimation } from './animations/QrCodeAnimation';

const HeroSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background particles and grid */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgb(3,7,18)_100%)]"></div>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      
      <motion.div 
        className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center"
        style={{ y, opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-6">
            <QrCode className="w-4 h-4 mr-2" />
            <span>Scan the Future</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
            Your Unbreakable Seal
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-secondary-300">
            of Authenticity
          </span>
        </motion.h1>

        <motion.p
          className="max-w-3xl text-lg md:text-xl text-neutral-400 mb-10"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          The gold standard for product authenticity and anti-counterfeiting through
          secure, dynamic QR codes. Protect your brand, verify your products, and
          connect with your customers like never before.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.a
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary-500 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
          <motion.a
            href="#product-flow"
            className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800/40 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See How It Works
          </motion.a>
        </motion.div>

        <motion.div
          className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="w-6 h-6 text-white opacity-70" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;