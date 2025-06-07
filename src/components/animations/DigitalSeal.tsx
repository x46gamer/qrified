import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const DigitalSeal = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Generate grid of dots
  const gridSize = 12;
  const dots = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    const distance = Math.sqrt(
      Math.pow((gridSize / 2) - x, 2) + 
      Math.pow((gridSize / 2) - y, 2)
    );
    const delay = distance * 0.05;
    return { x, y, delay };
  });

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {/* QR code central element */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: inView ? 1 : 0,
          scale: inView ? 1 : 0.8,
          rotateY: inView ? [0, 180, 360] : 0,
        }}
        transition={{ 
          duration: 2,
          rotateY: { 
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48 bg-neutral-900 rounded-xl overflow-hidden border-2 border-primary-500 shadow-glow">
          <div className="absolute inset-2 bg-neutral-950 rounded-lg grid grid-cols-7 grid-rows-7 gap-1 p-2">
            {/* QR Code pattern - stylized */}
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
                <motion.div
                  key={index}
                  className={`rounded-sm ${shouldFill ? 'bg-primary-500' : 'bg-transparent'}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: inView ? 1 : 0,
                    scale: inView ? 1 : 0,
                    backgroundColor: shouldFill ? '#0049FF' : 'transparent'
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: (row + col) * 0.02
                  }}
                />
              );
            })}
          </div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute inset-0 w-full h-1 bg-primary-400/60"
            animate={{ 
              y: [0, 160, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        </div>
      </motion.div>

      {/* Orbiting particles */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...Array(6)].map((_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          const x = Math.cos(angle) * 150;
          const y = Math.sin(angle) * 150;
          
          return (
            <motion.div
              key={index}
              className="absolute w-3 h-3 rounded-full bg-primary-400"
              style={{ 
                left: 'calc(50% + 0px)', 
                top: 'calc(50% + 0px)',
                filter: 'blur(2px)' 
              }}
              animate={{ 
                x: [x * 0.8, x, x * 0.8], 
                y: [y * 0.8, y, y * 0.8],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 5 + index, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
          );
        })}
      </motion.div>

      {/* Grid of animated dots */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md grid grid-cols-12 gap-1">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-primary-400/50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: inView ? [0, 0.8, 0] : 0,
              scale: inView ? [0, 1, 0] : 0
            }}
            transition={{
              duration: 3,
              delay: dot.delay,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,73,255,0.15)_0,rgba(0,0,0,0)_70%)]"></div>
    </motion.div>
  );
};

export default DigitalSeal;