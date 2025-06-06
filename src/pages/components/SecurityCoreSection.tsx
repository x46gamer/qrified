import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lock, ShieldCheck, Key, ServerCrash } from 'lucide-react';

const SecurityCoreSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const securityFeatures = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "Military-grade encryption protects all data in transit and at rest, making your information impenetrable.",
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Public Key Infrastructure",
      description: "Advanced PKI ensures only authorized entities can create valid QR codes, eliminating counterfeits.",
    },
    {
      icon: <ServerCrash className="h-6 w-6" />,
      title: "Distributed Verification",
      description: "Our redundant verification network ensures 99.999% uptime, so authentication never fails.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Immutable Audit Trail",
      description: "Every scan and verification is securely logged, creating an unalterable record of product authenticity.",
    },
  ];

  return (
    <section
      id="security"
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Security grid background */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>

      {/* Animated security elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexagonal grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="hexagons"
                width="50"
                height="43.4"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(2) rotate(0)"
              >
                <path
                  d="M25 0 L50 14.4 L50 43.4 L25 57.7 L0 43.4 L0 14.4 Z"
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Animated security locks */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 10 + 5;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            return (
              <motion.div
                key={i}
                className="absolute text-primary-500/10"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                  fontSize: `${size}px`
                }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration,
                  repeat: Infinity,
                  delay
                }}
              >
                <Lock />
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 md:px-6 relative z-10"
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-4">
            <span>Engineered Like a Vault</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Security at the <span className="text-primary-400">Core</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            Our platform is built from the ground up with security as the foundation.
            We adhere to OWASP Top 10, CIS, and NIST guidelines to ensure your
            authentication system is impenetrable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 md:p-8"
              whileHover={{ 
                y: -5, 
                borderColor: 'rgba(0, 73, 255, 0.3)',
                boxShadow: '0 0 15px 0 rgba(0, 73, 255, 0.2)'
              }}
            >
              <div className="rounded-full bg-primary-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4 text-primary-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 1, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 0.9 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 p-6 md:p-8 bg-gradient-to-br from-primary-900/20 to-neutral-900/20 border border-primary-900/20 rounded-xl text-center"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Certified Security</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'CCPA Ready'].map((cert, index) => (
              <motion.div
                key={index}
                className="px-4 py-2 rounded-md bg-neutral-800/50 text-neutral-300 font-mono text-sm"
                whileHover={{ y: -2, backgroundColor: 'rgba(0, 73, 255, 0.2)' }}
              >
                {cert}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SecurityCoreSection;