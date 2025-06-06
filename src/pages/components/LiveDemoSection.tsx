import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Scan, CheckCircle, QrCode } from 'lucide-react';

const LiveDemoSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleScan = () => {
    if (isScanning || isVerified) return;
    
    setIsScanning(true);
    
    // Simulate scan verification process
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      
      // Reset after showing verification
      setTimeout(() => {
        setIsVerified(false);
      }, 3000);
    }, 2000);
  };

  return (
    <section
      id="live-demo"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,rgba(0,0,0,0)_70%)]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 1, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 border border-primary-700/50 text-primary-400 text-sm font-mono mb-4">
            <span>Scan It Yourself</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Experience <span className="text-primary-400">Live Verification</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-neutral-400">
            See how Qrified authenticates products in real-time with a simulated demo.
            Click on the QR code to see our verification process in action.
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
            initial={{ opacity: 1, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary-500/30"
              animate={{ 
                boxShadow: isVerified 
                  ? ['0 0 0 rgba(0, 73, 255, 0)', '0 0 30px rgba(0, 73, 255, 0.6)', '0 0 0 rgba(0, 73, 255, 0)'] 
                  : ['0 0 0 rgba(0, 73, 255, 0)', '0 0 15px rgba(0, 73, 255, 0.3)', '0 0 0 rgba(0, 73, 255, 0)']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            />

            {/* QR Code for scanning */}
            <motion.div
              className="relative bg-white p-4 rounded-xl shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
            >
              {/* QR Code pattern - stylized */}
              <div className="w-48 h-48 md:w-56 md:h-56 grid grid-cols-7 grid-rows-7 gap-1 bg-white">
                {Array.from({ length: 49 }).map((_, index) => {
                  // Create a stylized QR code pattern
                  const row = Math.floor(index / 7);
                  const col = index % 7;
                  const isPositionMarker = 
                    (row < 2 && col < 2) || 
                    (row < 2 && col > 4) || 
                    (row > 4 && col < 2);
                  
                  const isCenter = row === 3 && col === 3;
                  
                  // Deterministic but random-looking pattern
                  const patternValue = (row * 7 + col) % 4;
                  const shouldFill = isPositionMarker || isCenter || patternValue === 0 || patternValue === 3;
                  
                  return (
                    <div
                      key={index}
                      className={`rounded-sm ${shouldFill ? 'bg-neutral-900' : 'bg-transparent'}`}
                    />
                  );
                })}
              </div>

              {/* Qrified logo overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                <QrCode className="h-8 w-8 text-primary-500" />
              </div>

              {/* Scanning animation */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl"></div>
                    <motion.div 
                      className="absolute top-0 left-0 right-0 h-1 bg-primary-500"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ 
                        duration: 2,
                        ease: "linear",
                        repeat: 0
                      }}
                    />
                    <motion.div
                      className="relative z-10 flex flex-col items-center"
                      animate={{ scale: [0.9, 1.1, 0.9] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <Scan className="h-10 w-10 text-primary-500" />
                      <p className="mt-2 font-medium text-neutral-900">Scanning...</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verification animation */}
              <AnimatePresence>
                {isVerified && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 bg-success-500/90 backdrop-blur-sm rounded-xl"></div>
                    <motion.div
                      className="relative z-10 flex flex-col items-center text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                    >
                      <CheckCircle className="h-12 w-12" />
                      <p className="mt-2 font-bold text-xl">Authentic</p>
                      <p className="text-sm opacity-90">Product Verified by Qrified</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 1, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-neutral-400 mb-4">
              {isScanning ? "Scanning in progress..." : 
               isVerified ? "Product authenticated successfully!" : 
               "Click on the QR code above to simulate scanning"}
            </p>
            <p className="text-sm text-neutral-500">
              In a real-world scenario, customers would simply use their phone's camera.
              <br />No special app required — just point and scan for instant verification.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;