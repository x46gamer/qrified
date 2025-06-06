import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, QrCode } from 'lucide-react';

const FinalCTASection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = 2 + (Math.random() * 4);
          const duration = 20 + (Math.random() * 40);
          const delay = Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary-500"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 1.1 + (Math.random() * 0.3)
              }}
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 20 - 10],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay
              }}
            />
          );
        })}
      </div>

      <motion.div
        style={{ y, scale }}
        className="container mx-auto px-4 md:px-6 relative z-10"
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 1 }}
          animate={inView ? { opacity: 1 } : { opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-900/40 to-neutral-900/40 backdrop-blur-md border border-primary-700/30 rounded-2xl p-8 md:p-12 shadow-glow-strong overflow-hidden">
            <div className="relative">
              <motion.div
                initial={{ opacity: 1, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center mb-6"
              >
                <QrCode className="h-16 w-16 text-primary-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 1, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-center"
              >
                <span className="text-white">Secure Anything, </span>
                <span className="text-primary-400">Instantly</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 1, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-neutral-300 mb-8 text-center max-w-2xl mx-auto"
              >
                Join industry leaders in protecting your brand with the most sophisticated
                authentication technology available today.
              </motion.p>

              <motion.div
                initial={{ opacity: 1, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <motion.a
                  href="/signup"
                  className="inline-flex h-14 items-center justify-center rounded-md bg-primary-500 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#pricing"
                  className="inline-flex h-14 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800/40 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Pricing
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 1, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400"
              >
                {['No credit card required', 'Free 14-day trial', '24/7 support', 'Cancel anytime'].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-500" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Import the Check icon
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default FinalCTASection;