import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { QrCode, Paintbrush, Scan, CheckCircle } from 'lucide-react';

const ProductFlowSection = () => {
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
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const steps = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Create",
      description: "Generate unique, secure QR codes for each of your products with just a few clicks.",
      color: "from-primary-500 to-primary-700"
    },
    {
      icon: <Paintbrush className="h-6 w-6" />,
      title: "Customize",
      description: "Style your QR codes to match your brand's aesthetic while maintaining security.",
      color: "from-secondary-500 to-secondary-700"
    },
    {
      icon: <Scan className="h-6 w-6" />,
      title: "Deploy",
      description: "Apply codes to your products via printing, etching, or digital embedding.",
      color: "from-accent-500 to-accent-700"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Verify",
      description: "Instant authentication when anyone scans your product, anywhere in the world.",
      color: "from-success-500 to-green-700"
    }
  ];

  return (
    <section
      id="product-flow"
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Flowing background */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]"></div>
        
        {/* Animated flowing lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => {
            const y = 10 + (i * 8);
            const duration = 15 + (i % 5);
            const delay = i * 0.5;
            const width = 30 + (i * 5);
            const opacity = 0.1 - (i * 0.01);

            return (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                style={{ 
                  top: `${y}%`, 
                  width: `${width}%`,
                  opacity
                }}
                animate={{ 
                  left: ['-20%', '120%'],
                }}
                transition={{ 
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay
                }}
              />
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
            <span>Authentication in Motion</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            How <span className="text-primary-400">Qrified</span> Works
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            Our streamlined process makes implementing advanced authentication
            simple, from generation to verification, in just four steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/4 left-[calc(50%-1px)] w-0.5 h-3/4 bg-gradient-to-b from-primary-500/80 to-success-500/80 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}
                initial={{ opacity: 1, x: index % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 1, x: index % 2 === 0 ? -20 : 20 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`hidden md:flex absolute top-0 ${
                    index % 2 === 0 ? 'right-0' : 'left-0'
                  } w-10 h-10 rounded-full items-center justify-center z-10 bg-gradient-to-br ${step.color}`}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.4 + index * 0.2 
                  }}
                >
                  {step.icon}
                </motion.div>

                {/* Mobile icon (visible only on small screens) */}
                <div className="flex md:hidden mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color}`}>
                    {step.icon}
                  </div>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-neutral-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="#live-demo"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary-500 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See It in Action
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductFlowSection;